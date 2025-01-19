export interface User {
    id: string;
    usuario: string;
    estado: 'ACTIVO' | 'INACTIVO'; 
    sector: number;
  }