// src/repositories/auth.repository.js
import { api } from 'src/boot/axios';
import { IDrolAdmin, DEFAULT_ADMIN } from 'src/constants/roles';

export class AuthRepository {
  // Recibe el objeto que proviene del login: { usuario, token }
  async getDashboardData(loginData) {
    try {
      const { usuario, token } = loginData;
      const usuarioRef = usuario.id || usuario._id;

      // 1) Obtener sala del usuario
      const salaRes = await api.get(`salas/${usuarioRef}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!salaRes || !salaRes.data) throw new Error('No se pudo obtener sala');
      const sala = salaRes.data;

      // El id del asesor puede venir en distintas propiedades según el backend
      const asesorId = sala.adminRef || sala.rolRef || sala.asesorRef || sala.asesor;

      // 2) Obtener lista de administradores
      const adminsRes = await api.get(`Usuario/rol/${IDrolAdmin}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!adminsRes || !adminsRes.data) throw new Error('No se pudo obtener administradores');
      const adminList = adminsRes.data;

      // 3) Buscar el asesor asignado dentro de la lista de admins
      const asesor = adminList.find(a => {
        const aId = a.id || a._id || (a._id && a._id.$oid);
        return String(aId) === String(asesorId);
      }) || null;

      // Si no se encuentra asesor asignado, devolver admin por defecto
      const finalAsesor = asesor || DEFAULT_ADMIN;

      // 4) Construir objeto final
      return {
        usuario: {
          id: usuario.id || usuario._id,
          nombre: usuario.nombre,
          correo: usuario.correo,
          telefono: usuario.telefono || null
        },
        sala,
        asesor: finalAsesor
          ? { id: finalAsesor.id || finalAsesor._id, nombre: finalAsesor.nombre, correo: finalAsesor.correo }
          : { id: null, nombre: null, correo: null }
      };
    } catch (e) {
      console.error('AuthRepository.getDashboardData error:', e);
      throw e;
    }
  }
}

export const authRepository = new AuthRepository();
