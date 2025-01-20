/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { Button } from 'primereact/button';

const Header: React.FC = () => {
  return (
    <header
      className="custom-blue-bg text-white p-2 flex justify-between items-center w-full fixed top-0 left-0"
      style={{ height: '40px', zIndex: 1000 }}
    >
      <div className="flex items-center h-full">
        <img src="/dux.png" alt="Dux Logo" className="mr-2" style={{ height: '100%' }} />
      </div>
      <div className="flex items-center h-full ml-auto">
        <Button
          icon="pi pi-cog"
          className="p-button-rounded p-button-text p-button-lg text-white"
          style={{ height: '100%' }}
        />
      </div>
    </header>
  );
};

export default Header;
