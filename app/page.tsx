"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import WeaponForm from './components/WeaponForm';
import WeaponList from './components/WeaponList';

type WeaponConfig = {
  id?: number;
  username: string;
  weaponCode: string;
  weaponType: string;
  weaponName: string;
  gameMode: string;
  rangeType: string[]; // Cambiado a array para múltiples selecciones
  copy_count?: number;
  created_at?: string;
};

const HomePage = () => {
  const [weaponConfigs, setWeaponConfigs] = useState<WeaponConfig[]>([]);
  const [loading, setLoading] = useState(true);

  // Cargar configuraciones al montar
  useEffect(() => {
    const fetchConfigs = async () => {
      try {
        const response = await fetch('/api/weaponConfigs');
        if (response.ok) {
          const data = await response.json();
          setWeaponConfigs(data);
        }
      } catch (error) {
        console.error('Error cargando configuraciones:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchConfigs();
  }, []);

  const handleAddWeaponConfig = async (config: WeaponConfig) => {
    try {
      const response = await fetch('/api/weaponConfigs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      });
      if (response.ok) {
        setWeaponConfigs([...weaponConfigs, config]);
      } else {
        console.error('Error guardando configuración');
      }
    } catch (error) {
      console.error('Error enviando configuración:', error);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-700 text-white">
      {/* Header */}
      <header className="flex items-center justify-between p-6 bg-black bg-opacity-50">
        <div className="flex items-center space-x-4">
          <Image
            src="/img/delta-force-logo.png"
            alt="Delta Force Logo"
            width={180}
            height={40}
            className="rounded bg-transparent"
            priority
          />
          <h1 className="text-2xl font-bold">Delta Force Community Hub</h1>
        </div>
        <nav>
          <ul className="flex space-x-6">
            <li><a href="#welcome" className="hover:text-yellow-400">Inicio</a></li>
            <li><a href="#share" className="hover:text-yellow-400">Compartir</a></li>
            <li><a href="#configs" className="hover:text-yellow-400">Configuraciones</a></li>
          </ul>
        </nav>
      </header>

      {/* Bienvenida */}
      <section id="welcome" className="text-center py-20 px-6">
        <h2 className="text-4xl font-bold mb-4">¡Bienvenido a la Comunidad de Delta Force!</h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Comparte tus configuraciones de armas personalizadas, descubre builds de otros jugadores y mejora tu experiencia en el juego.
          Tanto para Conflicto Bélico como para Operaciones, encuentra códigos para armas de corto, medio y largo alcance.
        </p>
        <Image
          src="/img/banner_01.jpg"
          alt="Banner Delta Force"
          width={800}
          height={400}
          className="mx-auto rounded-lg shadow-lg"
          priority
        />
      </section>

      {/* Sección Compartir */}
      <section id="share" className="py-20 px-6 bg-gray-800">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-10">Comparte tu Configuración</h3>
          <WeaponForm onSubmit={handleAddWeaponConfig} />
        </div>
      </section>

      {/* Sección Configuraciones */}
      <section id="configs" className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-10">Configuraciones Compartidas</h3>
          {loading ? (
            <p className="text-center text-gray-400">Cargando configuraciones...</p>
          ) : (
            <WeaponList weaponConfigs={weaponConfigs} />
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black bg-opacity-50 py-6 text-center">
        <p>&copy; 2026 Delta Force Community. Todos los derechos reservados.</p>
        <p>Recuerda: Juega responsablemente y respeta a la comunidad.</p>
      </footer>
    </div>
  );
};

export default HomePage;
