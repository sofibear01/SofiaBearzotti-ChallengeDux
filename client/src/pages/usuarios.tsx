import { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { createUser, fetchAllUsers, updateUser, fetchUsersBySector } from '@/services/userService';
import UserModal from '@/components/userModal';
import { User } from '@/types/user';

const UsuariosPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>(''); // Para buscar por coincidencia
  const [estado, setEstado] = useState<string | null>(null); // Para filtrar por estado
  const [isModalOpen, setIsModalOpen] = useState(false); // Control del modal
  const [selectedUser, setSelectedUser] = useState<User | null>(null); // Usuario seleccionado

  const estadoOptions = [
    { label: 'ACTIVO', value: 'ACTIVO' },
    { label: 'INACTIVO', value: 'INACTIVO' },
  ];

  useEffect(() => {
    async function loadUsers() {
      const data = await fetchUsersBySector(); // Filtrar por sector 7000
      setUsers(data);
      setFilteredUsers(data);
      setLoading(false);
    }
    loadUsers();
  }, []);


  useEffect(() => {
    const filter = users.filter(
      (user) =>
        user.usuario.toLowerCase().includes(search.toLowerCase()) &&
        (!estado || user.estado === estado)
    );
    setFilteredUsers(filter);
  }, [search, estado, users]);

  const openModal = (user: User | null) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedUser(null);
    setIsModalOpen(false);
  };

  const handleUserSubmit = async (user: User) => {
    try {
      // Validar que todos los campos estén completos
      if (!user.id || !user.usuario || !user.estado || user.sector === null) {
        throw new Error('Todos los campos deben estar completos.');
      }
  
      if (selectedUser) {
        // Editar usuario existente
        const updatedUser = await updateUser(user.id, user);
        const updatedUsers = users.map((u) => (u.id === selectedUser.id ? updatedUser : u));
        setUsers(updatedUsers);
        setFilteredUsers(updatedUsers.filter((user) => user.sector === 7000));
      } else {
        // Validar que el ID sea único entre todos los usuarios
        const allUsers = await fetchAllUsers(); // Traer todos los usuarios para verificar el ID
        const idExists = allUsers.some((u) => u.id === user.id);
  
        if (idExists && !selectedUser) {
          // Solo validar duplicado al agregar (no al editar)
          alert('El ID del usuario ya existe. Por favor, elige un ID único.');
          return; // Salir de la función sin continuar
        }
  
        // Agregar nuevo usuario
        const addedUser = await createUser(user);
        const updatedUsers = [...users, addedUser];
        setUsers(updatedUsers);
        setFilteredUsers(updatedUsers.filter((user) => user.sector === 7000));
      }
  
      closeModal(); // Cerrar el modal
    } catch (error) {
      console.error('Error al guardar el usuario:', error);
      if (error instanceof Error) {
        alert(error.message); // Mostrar mensaje al usuario
      } else {
        alert('Error desconocido'); // Mensaje genérico en caso de un error inesperado
      }
    }
  };
  

  const usuarioTemplate = (rowData: User) => {
    return (
      <Button className="p-button-link text-blue-500 underline" onClick={() => openModal(rowData)}>
        {rowData.usuario}
      </Button>
    );
  };

  if (loading) {
    return <p>Cargando usuarios...</p>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Usuarios</h1>

      {/* Barra de herramientas */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
          {/* Búsqueda por nombre/apellido */}
          <InputText
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre/apellido"
            className="p-inputtext-sm"
          />
          {/* Filtro por estado */}
          <Dropdown
            value={estado}
            options={estadoOptions}
            onChange={(e) => setEstado(e.value)}
            placeholder="Seleccionar Estado"
            className="p-dropdown-sm"
          />
        </div>
        {/* Botón para agregar usuario */}
        <Button label="Agregar Usuario" icon="pi pi-plus" className="p-button-sm" onClick={() => openModal(null)} />
      </div>

      {/* Tabla */}
      <DataTable
        value={filteredUsers}
        paginator
        rows={5}
        responsiveLayout="scroll"
        emptyMessage="No se encontraron usuarios."
      >
        <Column field="id" header="ID" />
        <Column field="usuario" header="Usuario" body={usuarioTemplate} />
        <Column field="estado" header="Estado" />
        <Column field="sector" header="Sector" />
      </DataTable>

      {/* Modal */}
      <UserModal
        visible={isModalOpen}
        onHide={closeModal}
        onSubmit={handleUserSubmit}
        userData={selectedUser}
      />
    </div>
  );
};

export default UsuariosPage;