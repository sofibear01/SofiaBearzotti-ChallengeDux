import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

interface User {
  id: string;
  usuario: string;
  estado: 'ACTIVO' | 'DESACTIVO';
  sector: number;
}

interface UserListProps {
  users: User[];
}

export default function UserList({ users }: UserListProps) {
  return (
    <DataTable value={users} responsiveLayout="scroll">
      <Column field="id" header="ID" />
      <Column field="usuario" header="Nombre de Usuario" />
      <Column field="estado" header="Estado" />
      <Column field="sector" header="Sector" />
    </DataTable>
  );
}
