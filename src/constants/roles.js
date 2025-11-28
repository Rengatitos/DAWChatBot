// src/constants/roles.js
export const IDrolAdmin = '6913adbcca79acfd93858d5c';
export const IDrolEmpOnb = '692284a99875b23f82fb7023';

// Admin por defecto para evitar valores "No asignado"
export const DEFAULT_ADMIN = {
  id: {
    timestamp: 1763844877,
    machine: 6685127,
    pid: 26124,
    increment: 15964062,
    creationTime: '2025-11-22T20:54:37Z'
  },
  nombre: 'jeferson',
  correo: 'jeff@gmail.com',
  passwordHash:
    '$2a$11$zNhbGKK8IvxpRTn.BkH8n.UbqaH2KAIS6QiWTyRkC9Zo6a0BCbXI2',
  area: null,
  rolRef: IDrolAdmin,
  nivelOnboarding: {
    etapa: 'Inicial',
    porcentaje: 0,
    ultimaActualizacion: '2025-11-22T20:54:36.604Z',
    estado: 'Activo'
  },
  telefono: '987402',
  estado: 'Activo'
};
