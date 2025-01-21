import { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { User } from '@/types/user';
import { Toast } from 'primereact/toast';

interface UserModalProps {
  visible: boolean;
  onHide: () => void;
  onSubmit: (user: User) => void;
  userData?: User | null; // Datos del usuario en caso de edición
  toastRef: React.RefObject<Toast | null>;
}

const UserModal: React.FC<UserModalProps> = ({ visible, onHide, onSubmit, userData, toastRef }) => {
  const [id, setId] = useState('');
  const [usuario, setUsuario] = useState('');
  const [estado, setEstado] = useState<'ACTIVO' | 'INACTIVO' | null>(null);
  const [sector, setSector] = useState<number | null>(null);

  const estadoOptions = [
    { label: 'Activo', value: 'ACTIVO' },
    { label: 'Inactivo', value: 'INACTIVO' },
  ];

  useEffect(() => {
    if (userData) {
      // Modo edición
      setId(userData.id);
      setUsuario(userData.usuario);
      setEstado(userData.estado);
      setSector(userData.sector);
    } else {
      // Modo creación
      setId('');
      setUsuario('');
      setEstado(null);
      setSector(null);
    }
  }, [userData]);

  const handleConfirm = () => {
     // Validar que todos los campos estén completos
  if (!id || !usuario || !estado || sector === null) {
    toastRef.current?.show({
      severity: 'error',
      summary: 'Error',
      detail: 'Todos los campos deben estar completos.',
      life: 3000,
    });
    return;
  }

    onSubmit({
      id,
      usuario,
      estado,
      sector,
    });
    onHide();
  };

  return (
    <Dialog
      header={userData ? 'Editar usuario' : 'Nuevo usuario'}
      visible={visible}
      onHide={onHide}
      style={{ width: '50vw' }}
      headerClassName="custom-dialog-header"
    >
      <div className="p-fluid">
        {/* ID */}
        <div className="p-field mt-4">
          <label htmlFor="id">Id:</label>
          <InputText
            id="id"
            value={id}
            onChange={(e) => setId(e.target.value)}
            placeholder="Ingrese el id del usuario"
            readOnly={!!userData} // Solo lectura si es edición
          />
        </div>

        {/* Nombre */}
        <div className="p-field mt-4">
          <label htmlFor="usuario">Nombre:</label>
          <InputText
            id="usuario"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            placeholder="Ingrese el nombre del usuario"
          />
        </div>

        {/* Estado */}
        <div className="p-field mt-4">
          <label htmlFor="estado">Estado:</label>
          <Dropdown
            id="estado"
            value={estado}
            options={estadoOptions}
            onChange={(e) => setEstado(e.value)}
            placeholder="Seleccione el estado"
          />
        </div>

        {/* Sector */}
        <div className="p-field mt-4">
          <label htmlFor="sector">Sector:</label>
          <InputText
            id="sector"
            value={sector !== null ? sector.toString() : ''}
            onChange={(e) => setSector(parseInt(e.target.value, 10))}
            placeholder="Ingrese el sector del usuario"
          />
        </div>
      </div>
      <div className="p-dialog-footer mt-4">
        <Button label="Confirmar" icon="pi pi-check" onClick={handleConfirm} className='custom-blue-bg rounded-button' autoFocus />
        <Button label="Cancelar" icon="pi pi-times" onClick={onHide} className="p-button-text custom-blue-text rounded-button" />
      </div>
    </Dialog>
  );
};

export default UserModal;