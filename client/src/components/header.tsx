/* eslint-disable @next/next/no-img-element */
import { Button } from 'primereact/button';
import React from 'react';

const Header: React.FC = () => {
    return (
        <header className="custom-blue-bg text-white p-2 flex items-center justify-between w-full fixed top-0 left-0" style={{ height: '40px' }}>
            <div className="flex items-center">
                <img src="/dux.png" alt="Dux Logo" className="mr-2" style={{ height: '100%', width: 'auto' }} />

            </div>
            <Button icon="pi pi-cog" className="p-button-rounded p-button-text p-button-lg text-white" />
        </header>
    );
};

export default Header;