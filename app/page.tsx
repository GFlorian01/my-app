"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import WeaponForm from './components/WeaponForm';
import WeaponList from './components/WeaponList';
import { normalizeWeaponType } from './lib/weaponParsing';
import Select from './components/ui/select';
import Button from './components/ui/button';

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

type RawWeaponConfig = {
  id?: number;
  username?: string;
  weapon_code?: string;
  weaponCode?: string;
  weapon_type?: string;
  weaponType?: string;
  weapon_name?: string;
  weaponName?: string;
  game_mode?: string;
  gameMode?: string;
  range_type?: unknown;
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
  const [isMobile, setIsMobile] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Función para normalizar un item de Supabase
  const normalizeWeaponConfig = (item: RawWeaponConfig): WeaponConfig => {
    return {
      id: item.id,
      username: item.username || '',
      weaponCode: item.weapon_code || item.weaponCode || '',
      weaponType: normalizeWeaponType(item.weapon_type || item.weaponType || ''),
      weaponName: item.weapon_name || item.weaponName || '',
      gameMode: item.game_mode || item.gameMode || '',
      rangeType: (() => {
        if (Array.isArray(item.range_type)) return item.range_type as string[];
        if (typeof item.range_type === 'string') {
          try {
            const parsed = JSON.parse(item.range_type);
            return Array.isArray(parsed) ? parsed : [];
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

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    const update = (matches: boolean) => setIsMobile(matches);
    update(mediaQuery.matches);
    const listener = (event: MediaQueryListEvent) => update(event.matches);
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    }
    mediaQuery.addListener(listener);
    return () => mediaQuery.removeListener(listener);
  }, []);

  useEffect(() => {
    setVideoLoaded(false);
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    const tryPlay = () => {
      v.play().catch(() => {});
    };
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') tryPlay();
    };
    v.addEventListener('canplay', tryPlay, { once: true });
    v.addEventListener('loadeddata', tryPlay, { once: true });
    document.addEventListener('visibilitychange', handleVisibility);
    tryPlay();
    return () => {
      v.removeEventListener('canplay', tryPlay);
      v.removeEventListener('loadeddata', tryPlay);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [isMobile]);

  // Calcular top 3
  const top3 = [...weaponConfigs]
    .sort((a, b) => {
      const aCount = a.copy_count || 0;
      const bCount = b.copy_count || 0;
      if (bCount !== aCount) return bCount - aCount;
      return (a.weaponName || '').localeCompare(b.weaponName || '');
    })
    .slice(0, 3);

  const getCreatedAtTime = (config: WeaponConfig) => {
    if (!config.created_at) return 0;
    const time = Date.parse(config.created_at);
    return Number.isNaN(time) ? 0 : time;
  };

  // Filtrar configuraciones
  const filteredConfigs = weaponConfigs.filter(config => {
    if (gameModeFilter && config.gameMode !== gameModeFilter) return false;
    if (weaponTypeFilter && config.weaponType !== weaponTypeFilter) return false;
    if (rangeTypeFilter && !config.rangeType.includes(rangeTypeFilter)) return false;
    return true;
  }).sort((a, b) => getCreatedAtTime(b) - getCreatedAtTime(a));

  // Opciones para filtros
  const gameModeOptions = [...new Set(weaponConfigs.map(c => c.gameMode))];
  const weaponTypeOptions = [...new Set(weaponConfigs.map(c => c.weaponType))];
  const rangeTypeOptions = ['Corto Alcance', 'Medio Alcance', 'Largo Alcance'];
  const videoSrc = isMobile ? '/img/mb_bg_01.mp4' : '/img/pc_bg_01.mp4';

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
        setWeaponConfigs([normalized, ...weaponConfigs]);
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
    <div className="app-container min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-800 text-white">
      {/* Header */}
      <header className="site-header sticky top-0 z-40 flex items-center justify-between p-4 bg-black/40 backdrop-blur border-b border-white/10">
        <div className="site-logo flex items-center space-x-4">
          <Image
            src="/img/logo_01.png"
            alt="Delta Force Logo"
            width={180}
            height={40}
            className="rounded bg-transparent"
            priority
          />
          <h1 className="site-title text-2xl font-bold tracking-tight">Delta Force Community Hub</h1>
        </div>
        <nav className="site-nav">
          <ul className="flex gap-4">
            <li><a href="#welcome" className="px-3 py-2 rounded hover:bg-white/10">Inicio</a></li>
            <li><a href="#share" className="px-3 py-2 rounded hover:bg-white/10">Compartir</a></li>
            <li><a href="#configs" className="px-3 py-2 rounded hover:bg-white/10">Configuraciones</a></li>
          </ul>
        </nav>
      </header>

      {/* Bienvenida */}
      <section id="welcome" className="welcome-section section-block text-center py-24 px-6">
        <div className="video-background">
          <video
            key={videoSrc}
            ref={videoRef}
            className={`video-media ${videoLoaded ? 'is-loaded' : ''}`}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            controls={false}
            onLoadedData={() => setVideoLoaded(true)}
            onCanPlay={() => setVideoLoaded(true)}
            onError={() => {
              setVideoLoaded(false);
              try {
                if (videoRef.current) {
                  videoRef.current.src = '/img/mb_bg_01.mp4';
                  videoRef.current.load();
                  videoRef.current.play().catch(() => {});
                }
              } catch {}
            }}
          >
            {!isMobile && <source src="/img/pc_bg_01.mp4" type="video/mp4" />}
            <source src="/img/mb_bg_01.mp4" type="video/mp4" />
          </video>
          <div className="video-overlay" />
        </div>
        <div className="welcome-content">
          <h2 className="welcome-title text-4xl md:text-5xl font-bold mb-4">¡Bienvenido a la Comunidad de Delta Force!</h2>
          <p className="welcome-text text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Comparte tus configuraciones de armas personalizadas, descubre builds de otros jugadores y mejora tu experiencia en el juego.
            Tanto para Conflicto Bélico como para Operaciones, encuentra códigos para armas de corto, medio y largo alcance.
          </p>
        </div>
      </section>

      {/* Top 3 Armas Más Copiadas */}
      {top3.length > 0 && (
        <section className="section-block py-12 px-6 bg-gray-900">
          <div className="max-w-4xl mx-auto">
            <h2 className="section-title text-3xl font-bold text-center mb-8 text-yellow-400">Top 3 Armas Más Copiadas</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {top3.map((config, index) => (
                <div key={config.id} className="bg-gray-800 p-6 rounded-lg shadow text-center border border-gray-700">
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

      {/* Sección Compartir */}
      <section id="share" className="section-block py-20 px-6 bg-gray-900">
        <div className="max-w-4xl mx-auto">
          <h3 className="section-title text-3xl font-bold text-center mb-10">Comparte tu Configuración</h3>
          {errorMessage && <p className="text-red-500 text-center mb-4">{errorMessage}</p>}
          <WeaponForm onSubmit={handleAddWeaponConfig} />
        </div>
      </section>

      {/* Sección Configuraciones */}
      <section id="configs" className="section-block py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h3 className="section-title text-3xl font-bold text-center mb-10">Configuraciones Compartidas</h3>
          
          {/* Filtros */}
          <div className="filter-bar mb-8 flex flex-wrap items-end justify-center gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Modo de Juego</label>
              <Select value={gameModeFilter} onChange={(e) => setGameModeFilter(e.target.value)} className="filter-select min-w-[220px]">
                <option value="">Todos</option>
                {gameModeOptions.map(mode => (
                  <option key={mode} value={mode}>{mode}</option>
                ))}
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Tipo de Arma</label>
              <Select value={weaponTypeFilter} onChange={(e) => setWeaponTypeFilter(e.target.value)} className="filter-select min-w-[220px]">
                <option value="">Todos</option>
                {weaponTypeOptions.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Tipo de Alcance</label>
              <Select value={rangeTypeFilter} onChange={(e) => setRangeTypeFilter(e.target.value)} className="filter-select min-w-[220px]">
                <option value="">Todos</option>
                {rangeTypeOptions.map(range => (
                  <option key={range} value={range}>{range}</option>
                ))}
              </Select>
            </div>
            <Button
              variant="outline"
              onClick={() => {
                setGameModeFilter('');
                setWeaponTypeFilter('');
                setRangeTypeFilter('');
              }}
            >
              Limpiar filtros
            </Button>
          </div>
          
          {loading ? (
            <p className="text-center text-gray-400">Cargando configuraciones...</p>
          ) : (
            <WeaponList weaponConfigs={filteredConfigs} onCopyCountUpdate={handleCopyCountUpdate} />
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/40 backdrop-blur border-t border-white/10 py-6 text-center">
        <p>&copy; 2026 Delta Force Community. Todos los derechos reservados.</p>
        <p>Recuerda: Juega responsablemente y respeta a la comunidad.</p>
      </footer>
    </div>
  );
};

export default HomePage;
