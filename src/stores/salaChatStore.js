// src/stores/salaChatStore.js
import { defineStore } from "pinia";
import { api } from "src/boot/axios";
import { useAuthStore } from "./authStore";
import { IDrolAdmin, IDrolEmpOnb, DEFAULT_ADMIN } from "src/constants/roles";

export const useSalaChatStore = defineStore("salaChat", {
  state: () => ({
    salaData: null,
    usuario: null,
    rol: null,
    asesor: null,
    actividades: [],
    recursos: [],
    catalogo: null,
    mensajes: []
  }),

  actions: {
    // ============================================================
    // 🔵 1. CARGAR SALA + USUARIO + ROL + ACTIVIDADES + RECURSOS
    // ============================================================
    async cargarSala(usuarioRef) {
      try {
        // 1) Sala
        const salaRes = await api.get(`salas/${usuarioRef}`);
        this.salaData = salaRes.data;

        // 2) Usuario
        const userRes = await api.get(`Usuario/${usuarioRef}`);
        this.usuario = userRes.data;

        // 3) Rol del usuario
        // Obtener rol: si el usuario no tiene rolRef asumimos Empleado Onboarding
        try {
          const roleId = this.usuario?.rolRef || IDrolEmpOnb;
          const rolRes = await api.get(`Rol/${roleId}`);
          this.rol = rolRes.data;
        } catch (err) {
          console.warn('No se pudo obtener rol, usando valores por defecto:', err);
          this.rol = { id: IDrolEmpOnb, nombre: 'Empleado Onboarding', permisos: ['chatbot'] };
        }

        // 4) Actividades
        const actRes = await api.get(`Actividad/Usuario/${usuarioRef}`);
        this.actividades = actRes.data;

        // 5) Recursos
        const recRes = await api.get("Recurso");
        this.recursos = recRes.data;

        // 6) Catálogo
        const catRes = await api.get("catalogo");
        this.catalogo = catRes.data;

        // 7) 🔥 Encontrar al asesor (ADMIN) asignado
        await this.cargarAsesorAsignado();

        return { ok: true };
      } catch (e) {
        console.error("Error cargando sala:", e);
        return { ok: false };
      }
    },

    // ============================================================
    // 🔵 Inicializar estado desde el dashboard provisto por Auth
    // ============================================================
    async inicializarDesdeDashboard() {
      const auth = useAuthStore();

      if (!auth.dashboardData) return;
      // Usar el usuario completo que viene del login (contiene rolRef)
      this.usuario = auth.user || auth.dashboardData.usuario;
      this.salaData = auth.dashboardData.sala;
      this.asesor = auth.dashboardData.asesor;

      // Obtener rol del usuario (o fallback a Empleado Onboarding)
      try {
        const roleId = this.usuario?.rolRef || IDrolEmpOnb;
        const rolRes = await api.get(`Rol/${roleId}`);
        this.rol = rolRes.data;
      } catch (e) {
        console.warn('No se pudo obtener rol en inicializarDesdeDashboard:', e);
        this.rol = { id: IDrolEmpOnb, nombre: 'Empleado Onboarding', permisos: ['chatbot', 'Observar_Avance'] };
      }

      // cargar actividades, recursos y catálogo
      try {
        const act = await api.get(`Actividad/Usuario/${this.usuario.id}`);
        this.actividades = act.data;
      } catch (e) {
        console.warn('No se pudieron obtener actividades:', e);
        this.actividades = [];
      }

      try {
        const rec = await api.get("Recurso");
        this.recursos = rec.data;
      } catch (e) {
        console.warn('No se pudieron obtener recursos:', e);
        this.recursos = [];
      }

      try {
        const cat = await api.get("catalogo");
        this.catalogo = cat.data;
      } catch (e) {
        console.warn('No se pudo obtener catálogo:', e);
        this.catalogo = null;
      }
    },

    // ============================================================
    // 🔥 2. ENCONTRAR ASESOR ASIGNADO (el administrador)
    // ============================================================
    async cargarAsesorAsignado() {
      try {
        // Intentar obtener lista de administradores desde el endpoint específico
        const adminsRes = await api.get(`Usuario/rol/${IDrolAdmin}`);
        const admins = adminsRes.data || [];

        // El id del asesor asignado suele estar en la sala
        const asesorId = this.salaData?.adminRef || this.salaData?.rolRef || this.salaData?.asesorRef || this.salaData?.asesor;

        const encontrado = admins.find(a => {
          const aId = a.id || a._id || (a._id && a._id.$oid);
          return String(aId) === String(asesorId);
        });

        // Si no se encuentra, usar admin por defecto
        this.asesor = encontrado || DEFAULT_ADMIN;
      } catch (e) {
        console.warn('No se encontró asesor asignado (falló petición), usando admin por defecto:', e);
        this.asesor = DEFAULT_ADMIN;
      }
    },

    // ============================================================
    // 🔵 3. GENERAR SYSTEM PROMPT COMPLETO PARA OLLAMA
    // ============================================================
    buildSystemPrompt() {
      const u = this.usuario;
      const r = this.rol;
      const n = this.salaData?.nivelOnboarding;
      const a = this.asesor;

      return `
Eres OnboardingBot, asistente oficial de Tata Consultancy Services (TCS).
Responde SIEMPRE en español y en máximo 2–3 líneas.

=== DATOS DEL USUARIO ===
Nombre: ${u?.nombre}
Correo: ${u?.correo}
Teléfono: ${u?.telefono}

=== ROL ===
Rol: ${r?.nombre}
Permisos: ${r?.permisos?.join(", ")}

=== NIVEL ONBOARDING ===
Etapa: ${n?.etapa}
Porcentaje: ${n?.porcentaje}%
Estado: ${n?.estado}

=== ASESOR ASIGNADO ===
Nombre: ${a?.nombre || "No asignado"}
Correo: ${a?.correo || "No disponible"}

=== ACTIVIDADES ===
${this.actividades.slice(0, 5).map(a => `- ${a.titulo} (${a.estado})`).join("\n")}

=== RECURSOS ===
${this.recursos.slice(0, 3).map(r => `- ${r.descripcion}: ${r.link}`).join("\n")}

=== INSTRUCCIONES ===
- Responde SIEMPRE en español.
- Sé amable y preciso.
- Si preguntan por su asesor, responde: "Tu asesor asignado es ${a?.nombre} (correo ${a?.correo})".
`.trim();
    },

    // ============================================================
    // 🔵 4. ENVIAR A OLLAMA VIA DUCKDNS
    // ============================================================
    async enviarAollama(mensajeUsuario) {
      const url = "https://ollamadaw.duckdns.org/api/chat";

      const payload = {
        model: "llama3.2:3b-instruct-q4_K_M",
        stream: false,
        messages: [
          { role: "system", content: this.buildSystemPrompt() },
          { role: "user", content: mensajeUsuario }
        ]
      };

      console.warn("🔥 JSON ENVIADO A OLLAMA:", payload);

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      return data?.message?.content || "No pude generar respuesta";
    },

    // ============================================================
    // 🔵 5. OLLAMA + GUARDAR EN BACKEND
    // ============================================================
    async enviarInteraccion(usuarioRef, mensajeUsuario) {
      try {
        const respuesta = await this.enviarAollama(mensajeUsuario);

        await api.post("InteraccionChat/chat", {
          usuarioRef,
          mensajeUsuario,
          respuestaChatbot: respuesta,
          contexto: this.buildSystemPrompt()
        });

        return { ok: true, respuesta };
      } catch (e) {
        console.error("Error enviando interacción:", e);
        return { ok: false };
      }
    },

    agregarMensajeUsuario(text) {
      this.mensajes.push({ from: "user", text, time: new Date().toISOString() });
    },

    agregarMensajeBot(text) {
      this.mensajes.push({ from: "bot", text, time: new Date().toISOString() });
      return this.mensajes.length - 1;
    },

    reemplazarMensaje(i, msg) {
      this.mensajes[i] = msg;
    }
  }
});
