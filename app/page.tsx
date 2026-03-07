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
  const [errorMessage, setErrorMessage] = useState('');
  const [gameModeFilter, setGameModeFilter] = useState('');
  const [weaponTypeFilter, setWeaponTypeFilter] = useState('');
  const [rangeTypeFilter, setRangeTypeFilter] = useState('');

  // Función para normalizar un item de Supabase
  const normalizeWeaponConfig = (item: any): WeaponConfig => {
    return {
      id: item.id,
      username: item.username || '',
      weaponCode: item.weapon_code || item.weaponCode || '',
      weaponType: item.weapon_type || item.weaponType || '',
      weaponName: item.weapon_name || item.weaponName || '',
      gameMode: item.game_mode || item.gameMode || '',
      rangeType: (() => {
        if (Array.isArray(item.range_type)) return item.range_type;
        if (typeof item.range_type === 'string') {
          try {
            return JSON.parse(item.range_type);
          } catch {
            return [];
          }
        }
        return [];
      })(),
      copy_count: item.copy_count || 0,
      created_at: item.created_at,
    };
  };

  // Cargar configuraciones al montar
  useEffect(() => {
    const fetchConfigs = async () => {
      try {
        const response = await fetch('/api/weaponConfigs');
        if (response.ok) {
          const data = await response.json();
          const normalized = data.map(normalizeWeaponConfig);
          setWeaponConfigs(normalized);
        }
      } catch (error) {
        console.error('Error cargando configuraciones:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchConfigs();
  }, []);

  // Calcular top 3
  const top3 = [...weaponConfigs]
    .sort((a, b) => {
      const aCount = a.copy_count || 0;
      const bCount = b.copy_count || 0;
      if (bCount !== aCount) return bCount - aCount;
      return (a.weaponName || '').localeCompare(b.weaponName || '');
    })
    .slice(0, 3);

  // Filtrar configuraciones
  const filteredConfigs = weaponConfigs.filter(config => {
    if (gameModeFilter && config.gameMode !== gameModeFilter) return false;
    if (weaponTypeFilter && config.weaponType !== weaponTypeFilter) return false;
    if (rangeTypeFilter && !config.rangeType.includes(rangeTypeFilter)) return false;
    return true;
  });

  // Opciones para filtros
  const gameModeOptions = [...new Set(weaponConfigs.map(c => c.gameMode))];
  const weaponTypeOptions = [...new Set(weaponConfigs.map(c => c.weaponType))];
  const rangeTypeOptions = ['Corto Alcance', 'Medio Alcance', 'Largo Alcance'];

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
        const data = await response.json();
        const normalized = normalizeWeaponConfig(data.config);
        setWeaponConfigs([...weaponConfigs, normalized]);
        setErrorMessage('');
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error);
      }
    } catch (error) {
      console.error('Error enviando configuración:', error);
      setErrorMessage('Error de conexión al guardar la configuración');
    }
  };

  const handleCopyCountUpdate = (id: number, newCount: number) => {
    setWeaponConfigs(prevConfigs =>
      prevConfigs.map(config =>
        config.id === id ? { ...config, copy_count: newCount } : config
      )
    );
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

      {/* Top 3 Armas Más Copiadas */}
      {top3.length > 0 && (
        <section className="py-10 px-6 bg-gray-800">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8 text-yellow-400">Top 3 Armas Más Copiadas</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {top3.map((config, index) => (
                <div key={config.id} className="bg-gray-700 p-6 rounded-lg shadow-lg text-center">
                  <div className="text-4xl font-bold text-yellow-400 mb-2">#{index + 1}</div>
                  <h3 className="text-xl font-bold mb-2">{config.weaponName}</h3>
                  <p className="mb-1"><strong>Tipo:</strong> {config.weaponType}</p>
                  <p className="mb-1"><strong>Modo:</strong> {config.gameMode}</p>
                  <p className="text-sm text-gray-400">Copiado {config.copy_count} veces</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

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
          {errorMessage && <p className="text-red-500 text-center mb-4">{errorMessage}</p>}
          <WeaponForm onSubmit={handleAddWeaponConfig} />
        </div>
      </section>

      {/* Sección Configuraciones */}
      <section id="configs" className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-10">Configuraciones Compartidas</h3>
          
          {/* Filtros */}
          <div className="mb-8 flex flex-wrap justify-center gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Modo de Juego:</label>
              <select
                value={gameModeFilter}
                onChange={(e) => setGameModeFilter(e.target.value)}
                className="p-2 bg-gray-700 border border-gray-500 rounded"
              >
                <option value="">Todos</option>
                {gameModeOptions.map(mode => (
                  <option key={mode} value={mode}>{mode}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Tipo de Arma:</label>
              <select
                value={weaponTypeFilter}
                onChange={(e) => setWeaponTypeFilter(e.target.value)}
                className="p-2 bg-gray-700 border border-gray-500 rounded"
              >
                <option value="">Todos</option>
                {weaponTypeOptions.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Tipo de Alcance:</label>
              <select
                value={rangeTypeFilter}
                onChange={(e) => setRangeTypeFilter(e.target.value)}
                className="p-2 bg-gray-700 border border-gray-500 rounded"
              >
                <option value="">Todos</option>
                {rangeTypeOptions.map(range => (
                  <option key={range} value={range}>{range}</option>
                ))}
              </select>
            </div>
          </div>
          
          {loading ? (
            <p className="text-center text-gray-400">Cargando configuraciones...</p>
          ) : (
            <WeaponList weaponConfigs={filteredConfigs} onCopyCountUpdate={handleCopyCountUpdate} />
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
