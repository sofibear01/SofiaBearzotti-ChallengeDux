import { API_URL, LIMIT, SECTOR } from '../config/config';
import { User } from '@/types/user';  

/**
 * Obtiene los usuarios de la API.
 * @returns Un array de usuarios.
 */
export async function fetchUsersBySector(): Promise<User[]> {
  const response = await fetch(`${API_URL}?sector=${SECTOR}`, {
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

/**
 * Obtiene los usuarios de la API con paginado.
 * @param page Número de la página.
 * @returns Un array de usuarios.
 */
/**
 * Obtiene los usuarios de la API con paginado.
 * @param page Número de la página.
 * @returns Un array de usuarios.
 */
export async function fetchUsersByPage(page: number): Promise<{ users: User[], totalRecords: number }> {
  const params = new URLSearchParams({
    sector: SECTOR.toString(),
    _limit: LIMIT.toString(),
    _page: page.toString(),
  });

  console.log("entra a la API");
  console.log("parametros: ", params.toString());

  const response = await fetch(`${API_URL}?${params.toString()}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  console.log(response);

  if (!response.ok) {
    throw new Error('Error al obtener los usuarios');
  }

  const totalRecords = Number(response.headers.get('X-Total-Count')); // Asegúrate de que el backend envíe este header
  const users = await response.json();
  console.log("totalRecords: ", totalRecords);
  console.log("users: ", users);

  return { users, totalRecords };
}



/**
 * Obtiene todos los usuarios de la API.
 * @returns Un array de usuarios.
 */
export async function fetchAllUsers(): Promise<User[]> {
  const response = await fetch(`${API_URL}`, {
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


/**
 * Crea un nuevo usuario en la API.
 * @param user Datos del usuario a crear.
 * @returns El usuario creado.
 */
export async function createUser(user: User): Promise<User> {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  });

  if (!response.ok) {
    throw new Error('Error al crear el usuario');
  }

  return response.json();
}

/**
 * Modifica un usuario existente en la API.
 * @param id ID del usuario a modificar.
 * @param user Datos actualizados del usuario.
 * @returns El usuario actualizado.
 */
export async function updateUser(id: string, user: Partial<User>): Promise<User> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  });

  if (!response.ok) {
    throw new Error('Error al actualizar el usuario');
  }

  return response.json();
}

export async function fetchLastUser(): Promise<User> {
  const response = await fetch(`${API_URL}?_sort=id&_order=desc&_limit=1`);
  if (!response.ok) {
    throw new Error('Failed to fetch last user');
  }
  const users = await response.json();
  return users[0];
}

