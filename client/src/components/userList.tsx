import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { User } from '@/types/user';
import { JSX } from 'react';

interface UserListProps {
  users: User[];
  usuarioTemplate: (rowData: User) => JSX.Element;
  actionTemplate: (rowData: User) => JSX.Element;
}

const UserList: React.FC<UserListProps> = ({ users, usuarioTemplate, actionTemplate }) => {
  return (
    <DataTable value={users} responsiveLayout="scroll" paginator rows={10}>
      <Column field="id" header="ID" />
      <Column field="usuario" header="Usuario" body={usuarioTemplate} />
      <Column field="estado" header="Estado" />
      <Column field="sector" header="Sector" />
      <Column body={actionTemplate} header="Acciones" />
    </DataTable>
  );
};

export default UserList;
