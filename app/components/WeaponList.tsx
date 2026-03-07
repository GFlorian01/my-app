import React, { useRef, useState } from 'react';
import Image from 'next/image';

type WeaponConfig = {
  id?: number;
  username: string;
  weaponCode: string;
  weaponType: string;
  weaponName: string;
  gameMode: string;
  rangeType: string[];
  copy_count?: number;
  created_at?: string;
};

function getSafeRangeType(rangeType: unknown): string[] {
  if (Array.isArray(rangeType)) return rangeType;
  if (typeof rangeType === 'string') {
    try {
      const parsed = JSON.parse(rangeType);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
}

type WeaponListProps = {
  weaponConfigs: WeaponConfig[];
  onCopyCountUpdate: (id: number, newCount: number) => void;
};

const WeaponList = ({ weaponConfigs, onCopyCountUpdate }: WeaponListProps) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const cooldownTimers = useRef<Record<number, ReturnType<typeof setTimeout> | null>>({});
  const copyCooldownMs = 2000;

  const handleCopy = async (code: string, index: number, id: number) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);

      if (cooldownTimers.current[id]) {
        return;
      }
      cooldownTimers.current[id] = setTimeout(() => {
        cooldownTimers.current[id] = null;
      }, copyCooldownMs);

      const response = await fetch('/api/weaponConfigs', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });
      if (response.ok) {
        const data = await response.json();
        // Actualizar el contador localmente
        if (data.config) {
          onCopyCountUpdate(id, data.config.copy_count);
        }
      }
    } catch (err) {
      console.error('Error al copiar:', err);
    }
  };

  // Selección de imagen según el tipo de alcance (usa el primero si hay múltiples)
  const getWeaponImage = (rangeTypes: string[] = []) => {
    const primaryRange = rangeTypes[0] || 'Corto Alcance';
    if (primaryRange === 'Corto Alcance') return '/img/asalto_01.jpg';
    if (primaryRange === 'Medio Alcance') return '/img/smg_01.jpg';
    if (primaryRange === 'Largo Alcance') return '/img/francotirador_01.jpg';
    return '/img/asalto_01.jpg'; // Default
  };

  return (
    <div className="weapon-list">
      {weaponConfigs.length === 0 ? (
        <p className="text-center text-gray-400">No hay configuraciones compartidas aún. ¡Sé el primero en compartir!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {weaponConfigs.map((config, index) => (
            <div key={index} className="bg-gray-700 p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300">
              <Image
                src={getWeaponImage(getSafeRangeType(config.rangeType))}
                alt={`${config.weaponName} - ${getSafeRangeType(config.rangeType).join(', ')}`}
                width={400}
                height={180}
                className="rounded mb-4 object-cover w-full h-44"
              />
              <h3 className="text-xl font-bold mb-2 text-yellow-400">{config.username}</h3>
              <p className="mb-1"><strong className="text-gray-300">Tipo de Arma:</strong> {config.weaponType}</p>
              <p className="mb-1"><strong className="text-gray-300">Nombre del Arma:</strong> {config.weaponName}</p>
              <p className="mb-1"><strong className="text-gray-300">Código del Arma:</strong> <span className="font-mono bg-gray-600 px-2 py-1 rounded">{config.weaponCode}</span></p>
              <p className="mb-1"><strong className="text-gray-300">Modo de Juego:</strong> {config.gameMode}</p>
              <p className="mb-1"><strong className="text-gray-300">Tipo de Alcance:</strong> {getSafeRangeType(config.rangeType).join(', ')}</p>
              <p className="mb-2 text-sm text-gray-400">Copiado {config.copy_count || 0} veces</p>
              <button
                onClick={() => handleCopy(config.weaponCode, index, config.id!)}
                className="tap-button bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300"
              >
                {copiedIndex === index ? '¡Copiado!' : 'Copiar Código'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WeaponList;
