import React, { JSX } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Paginator } from 'primereact/paginator';
import { User } from '@/types/user';

interface UserListProps {
  users: User[];
  usuarioTemplate: (rowData: User) => JSX.Element;
  actionTemplate: (rowData: User) => JSX.Element;
  totalRecords: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (e: { first: number, rows: number, page: number, pageCount: number }) => void;
}

const UserList: React.FC<UserListProps> = ({ users, usuarioTemplate, actionTemplate, totalRecords, currentPage, pageSize, onPageChange }) => {
  return (
    <div>
      <DataTable value={users} responsiveLayout="scroll" paginator={false}>
        <Column field="id" header="ID" />
        <Column field="usuario" header="Nombre de Usuario" body={usuarioTemplate} />
        <Column field="estado" header="Estado" />
        <Column field="sector" header="Sector" />
        <Column body={actionTemplate} header="Acciones" />
      </DataTable>
      <Paginator
        first={currentPage * pageSize}
        rows={pageSize}
        totalRecords={totalRecords}
        onPageChange={onPageChange}
      />
    </div>
  );
};

export default UserList;