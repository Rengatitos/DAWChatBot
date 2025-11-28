<template>
  <q-page class="chat-page q-pa-md">
    <div class="chat-layout">

      <!-- CHAT PRINCIPAL -->
      <div class="chat-card">

        <div class="chat-header row items-center justify-between">
          <div>
            <div class="text-subtitle1 text-primary">OnboardingBot</div>
            <div class="text-caption text-grey-7">Tu asistente en TCS 💼</div>
          </div>
          <q-chip dense outline color="primary" text-color="primary" icon="bolt">
            En línea
          </q-chip>
        </div>

        <q-separator />

        <div class="messages" ref="msgs">
          <transition-group name="list" tag="div">
            <ChatBubble
              v-for="(m, i) in sala.mensajes"
              :key="i + '-' + m.time"
              :from="m.from"
              :text="m.text"
              :time="m.time"
            />
          </transition-group>
        </div>

        <div class="quick-actions row q-gutter-sm q-mb-sm">
          <q-chip
            v-for="(qa, i) in quickActions"
            :key="i"
            clickable
            color="primary"
            outline
            text-color="primary"
            @click="handleQuickAction(qa.text)"
          >
            {{ qa.label }}
          </q-chip>
        </div>

        <ChatInput :loading="sending" @send="handleSend" />

      </div>

      <!-- PANEL DE INFORMACIÓN -->
      <div class="info-card">
        <div class="text-h6 q-mb-sm">Información</div>
        <q-separator spaced />

        <div v-if="sala.salaData">
          <div class="info-block q-mb-md">
            <div class="text-caption text-grey-6">Etapa actual</div>
            <div class="text-body1 text-primary">
              {{ sala.salaData.nivelOnboarding?.etapa }}
            </div>
          </div>

          <div class="info-block q-mb-md">
            <div class="text-caption text-grey-6">Asesor</div>
            <div class="text-body1">{{ "Jefferson Garay" }}</div>
          </div>

          <div class="info-block q-mb-md">
            <div class="text-caption text-grey-6">Próxima actividad</div>
            <div class="text-body1">
              {{ sala.salaData.proximaActividad?.titulo || "N/A" }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, nextTick } from "vue";
import { useSalaChatStore } from "src/stores/salaChatStore";
import { useAuthStore } from "src/stores/authStore";
import ChatBubble from "src/components/ChatBubble.vue";
import ChatInput from "src/components/ChatInput.vue";

const auth = useAuthStore();
const sala = useSalaChatStore();
const msgs = ref(null);
const sending = ref(false);

const quickActions = [
  { label: "Mis actividades", text: "¿Qué actividades tengo hoy?" },
  { label: "Mis documentos", text: "¿Qué documentos debo entregar?" },
  { label: "Mi etapa", text: "¿En qué etapa estoy?" },
  { label: "Mi asesor", text: "¿Quién es mi asesor?" }
];

onMounted(async () => {
  if (!auth.user) {
    await auth.login("Gustavo.cts@gmail.com", "123456");
  }

  // Inicializar sala usando datos que suministra el AuthRepository
  await sala.inicializarDesdeDashboard();

  sala.agregarMensajeBot(
    `¡Hola ${sala.usuario?.nombre || auth.user?.nombre}! 😊 Soy tu asistente de onboarding. ¿En qué puedo ayudarte hoy?`
  );

  await nextTick();
  scrollToEnd();
});

function scrollToEnd() {
  const el = msgs.value;
  if (el) el.scrollTop = el.scrollHeight;
}

async function handleSend(text) {
  const userId = auth.user.id;

  sala.agregarMensajeUsuario(text);
  await nextTick();
  scrollToEnd();

  const loadingIndex = sala.agregarMensajeBot("...");

  sending.value = true;
  const res = await sala.enviarInteraccion(userId, text);
  sending.value = false;

  sala.reemplazarMensaje(loadingIndex, {
    from: "bot",
    text: res.respuesta,
    time: new Date().toISOString()
  });

  await nextTick();
  scrollToEnd();
}

function handleQuickAction(text) {
  handleSend(text);
}
</script>

<style scoped lang="scss">
.chat-page {
  background: linear-gradient(135deg, #eef2ff, #e0f2fe);
}

.chat-layout {
  display: grid;
  grid-template-columns: 3fr 1.2fr;
  gap: 16px;
}

.chat-card {
  background: white;
  border-radius: 20px;
  padding: 16px;
  box-shadow: 0 14px 40px rgba(15, 23, 42, 0.07);
  display: flex;
  flex-direction: column;
}

.messages {
  flex: 1;
  overflow-y: auto;
  max-height: 60vh;
  padding-right: 4px;
}

.info-card {
  background: white;
  border-radius: 20px;
  padding: 16px;
  box-shadow: 0 14px 40px rgba(15, 23, 42, 0.07);
}
</style>
