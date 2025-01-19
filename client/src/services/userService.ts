import { API_URL, SECTOR, LIMIT, PAGE } from '../config/config';

interface User {
  id: string;
  usuario: string;
  estado: 'ACTIVO' | 'DESACTIVO';
  sector: number;
}

export async function fetchUsers(): Promise<User[]> {
  const response = await fetch(`${API_URL}?sector=${SECTOR}&_limit=${LIMIT}&_page=${PAGE}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Error al obtener los usuarios');
  }

  return response.json();
}
