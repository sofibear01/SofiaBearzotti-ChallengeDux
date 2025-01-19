import { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { fetchUsers } from '@/services/userService';

const UsuariosPage: React.FC = () => {
  interface User {
    id: string;
    usuario: string;
    estado: 'ACTIVO' | 'DESACTIVO';
    sector: number;
  }

  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>(''); // Para buscar por coincidencia
  const [estado, setEstado] = useState<string | null>(null); // Para filtrar por estado

  const estadoOptions = [
    { label: 'Activo', value: 'ACTIVO' },
    { label: 'Inactivo', value: 'DESACTIVO' },
  ];

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await fetchUsers();
        setUsers(data);
        setFilteredUsers(data); // Mostrar todos los usuarios al cargar
      } catch (error) {
        console.error('Error al cargar usuarios:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  useEffect(() => {
    // Filtrar usuarios por búsqueda y estado
    const filter = users.filter(
      (user) =>
        user.usuario.toLowerCase().includes(search.toLowerCase()) &&
        (!estado || user.estado === estado)
    );
    setFilteredUsers(filter);
  }, [search, estado, users]);

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
            placeholder="Buscar usuario"
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
        <Button label="Agregar Usuario" icon="pi pi-plus" className="p-button-sm" />
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
        <Column field="usuario" header="Usuario" />
        <Column field="estado" header="Estado" />
        <Column field="sector" header="Sector" />
      </DataTable>
    </div>
  );
};

export default UsuariosPage;
