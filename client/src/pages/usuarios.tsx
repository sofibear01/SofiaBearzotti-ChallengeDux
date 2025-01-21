import { useState, useEffect, useRef } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { createUser, fetchAllUsers, updateUser, fetchUsersByPage } from '@/services/userService';
import UserModal from '@/components/userModal';
import { User } from '@/types/user';
import Header from '@/components/header';
import UserList from '@/components/userList';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { ProgressSpinner } from 'primereact/progressspinner';
import { LIMIT } from '@/config/config';
import { Paginator } from 'primereact/paginator';
//import debounce from 'lodash.debounce';

const UsuariosPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>(''); // Para buscar por coincidencia
  const [estado, setEstado] = useState<string | null>(null); // Para filtrar por estado
  const [isModalOpen, setIsModalOpen] = useState(false); // Control del modal
  const [selectedUser, setSelectedUser] = useState<User | null>(null); // Usuario seleccionado
  const toast = useRef<Toast>(null);

  //para manejar la paginacion
  const [totalRecords, setTotalRecords] = useState<number>(0); // Total de usuarios
  const [currentPage, setCurrentPage] = useState<number>(1); // Página actual
  const pageSize = LIMIT // Número de usuarios por página

  const estadoOptions = [
    { label: 'ACTIVO', value: 'ACTIVO' },
    { label: 'INACTIVO', value: 'INACTIVO' },
  ];

  useEffect(() => {
    async function loadUsers() {
      setLoading(true);
      try {
        const { users, totalRecords } = await fetchUsersByPage(currentPage);
        setUsers(users);
        setFilteredUsers(users); // Usa los datos paginados
        setTotalRecords(totalRecords);
      } catch (error) {
        console.error('Error al cargar los usuarios:', error);
      } finally {
        setLoading(false);
      }
    }
  
    loadUsers();
  }, [currentPage]);

  useEffect(() => {
    // Filtrar los usuarios en el frontend
    const filtered = users.filter(
      (user) =>
        user.usuario.toLowerCase().includes(search.toLowerCase()) &&
        (!estado || user.estado === estado)
    );
    setFilteredUsers(filtered);
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
      // Obtener todos los usuarios
      const allUsers = await fetchAllUsers();

      // Filtrar usuarios con datos incompletos
      const validUsers = allUsers.filter(
        (u) => u.sector !== null && u.usuario !== undefined && u.id !== undefined
      );

      if (!selectedUser) {
        // Validar que el ID sea único al crear
        const idExists = validUsers.some((u) => u.id === user.id);
        if (idExists) {
          toast.current?.show({
            severity: 'error',
            summary: 'Error',
            detail: 'El ID del usuario ya existe. Por favor, elige un ID único.',
            life: 4000,
          });
          return;
        }

        // Validar que el nombre de usuario sea único al crear
        const nameExists = validUsers.some(
          (u) => u.usuario.toLowerCase() === user.usuario.toLowerCase()
        );
        if (nameExists) {
          toast.current?.show({
            severity: 'error',
            summary: 'Error',
            detail: 'El nombre de usuario ya existe. Por favor, elige un nombre único.',
            life: 4000,
          });
          return;
        }

        // Crear el usuario
        const addedUser = await createUser(user);
        const updatedUsers = [addedUser, ...users];
        setUsers(updatedUsers);
        setFilteredUsers(updatedUsers.filter((user) => user.sector === 7000));
        toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Usuario creado correctamente', life: 3000 });
      } else {
        // Validar que el nombre de usuario sea único al editar
        const nameExists = validUsers.some(
          (u) => u.usuario.toLowerCase() === user.usuario.toLowerCase() && u.id !== user.id
        );
        if (nameExists) {
          toast.current?.show({
            severity: 'error',
            summary: 'Error',
            detail: 'El nombre de usuario ya existe. Por favor, elige un nombre único.',
            life: 4000,
          });
          return;
        }

        // Actualizar el usuario
        const updatedUser = await updateUser(user.id, user);
        const updatedUsers = users.map((u) => (u.id === selectedUser.id ? updatedUser : u));
        setUsers(updatedUsers);
        setFilteredUsers(updatedUsers.filter((user) => user.sector === 7000));
        toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Usuario actualizado correctamente', life: 3000 });
      }

      closeModal();
    } catch (error) {
      console.error('Error al guardar el usuario:', error);
      if (error instanceof Error) {
        toast.current?.show({
          severity: 'error',
          summary: 'Error',
          detail: error.message,
          life: 3000,
        });
      } else {
        toast.current?.show({
          severity: 'error',
          summary: 'Error',
          detail: 'Error desconocido',
          life: 3000,
        });
      }
    }
  };


  const handleDeactivateUser = async (user: User) => {
    try {
      const updatedUser: User = { ...user, estado: 'INACTIVO' };
      await updateUser(user.id, updatedUser);
      const updatedUsers = users.map((u) => (u.id === user.id ? updatedUser : u));
      setUsers(updatedUsers);
      setFilteredUsers(updatedUsers.filter((user) => user.sector === 7000));
      toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Usuario desactivado correctamente', life: 3000 });
    } catch (error) {
      console.error('Error al desactivar el usuario:', error);
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudo desactivar el usuario',
        life: 3000,
      });
    }
  };

  const confirmDeactivateUser = (user: User) => {
    confirmDialog({
      message: '¿Está seguro que desea dar de baja este usuario?',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => handleDeactivateUser(user),
    });
  };

  const usuarioTemplate = (rowData: User) => {
    return (
      <Button className="p-button-link custom-blue-text underline" onClick={() => openModal(rowData)}>
        {rowData.usuario}
      </Button>
    );
  };

  const actionTemplate = (rowData: User) => {
    return (
      <Button
        icon="pi pi-trash"
        className="p-button-rounded p-button-danger p-button-text"
        onClick={() => confirmDeactivateUser(rowData)}
        disabled={rowData.estado !== 'ACTIVO'}
      />
    );
  };

  const onPageChange = (e: { first: number, rows: number, page: number, pageCount: number }) => {
    setCurrentPage(e.page);
  };

  // const debouncedSearch = useCallback(
  //   debounce((searchTerm: string) => {
  //     setSearch(searchTerm);
  //   }, 300),
  //   []
  // );

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100vw', height: '100vh' }}>
        <ProgressSpinner />
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* Toast para notificaciones */}
      <Toast ref={toast} />
      <ConfirmDialog />
      <Header />
      <div className='flex justify-content-between align-items-center'>
        {/* Título alineado a la izquierda */}
        <h1 className="text-3xl font-bold">Usuarios</h1>

        {/* Botón para agregar usuario alineado a la derecha */}
        <Button
          label="Nuevo usuario"
          icon="pi pi-plus"
          className="rounded-button custom-blue-bg p-button-sm ml-auto px-2 font-semibold"
          onClick={() => openModal(null)}
        />
      </div>

      {/* Barra de herramientas */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
          {/* Búsqueda por nombre/apellido */}
          <InputText
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar"
            className="p-inputtext-sm"
          />

          {/* Filtro por estado */}
          <Dropdown
            value={estado}
            options={estadoOptions}
            onChange={(e) => setEstado(e.value)}
            placeholder="Seleccionar estado"
            className="p-dropdown-sm"
          />
        </div>

        {/* Botón para limpiar filtros */}
        <Button
          icon="pi pi-filter-slash"
          className="p-button-outlined p-button-sm ml-2"
          onClick={() => {
            setSearch('');
            setEstado(null);
          }}
        />
      </div>

      {/* Tabla */}
      <UserList
        users={filteredUsers} // Usuarios filtrados para mostrar
        usuarioTemplate={usuarioTemplate} // Template para mostrar el nombre
        actionTemplate={actionTemplate} // Template para las acciones
        totalRecords={totalRecords} // Total de usuarios (para la paginación)
        currentPage={currentPage} // Página actual
        pageSize={pageSize} // Número de usuarios por página
        onPageChange={onPageChange} // Manejar el cambio de página
      />

      {/* Paginación */}
      <Paginator
        first={(currentPage - 1) * pageSize}
        rows={pageSize}
        totalRecords={totalRecords}
        onPageChange={onPageChange}
        template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
        rowsPerPageOptions={[10, 20, 50]}
      />

      {/* Modal */}
      <UserModal
        visible={isModalOpen}
        onHide={closeModal}
        onSubmit={handleUserSubmit}
        userData={selectedUser}
        toastRef={toast}

      />
    </div>
  );
};

export default UsuariosPage;