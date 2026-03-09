import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { getWeaponImagePath, normalizeWeaponDisplayName } from '../lib/weaponParsing';
import { Card, CardContent } from './ui/card';
import Badge from './ui/badge';
import Button from './ui/button';

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

  return (
    <div className="weapon-list">
      {weaponConfigs.length === 0 ? (
        <p className="text-center text-gray-400">No hay configuraciones compartidas aún. ¡Sé el primero en compartir!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {weaponConfigs.map((config, index) => {
            const displayName = normalizeWeaponDisplayName(config.weaponName, config.weaponType);
            return (
            <Card key={index} className="hover:shadow-xl transition">
              <CardContent className="p-0">
                <div className="p-6">
                  <div className="relative mb-4">
                    <Image
                      src={getWeaponImagePath(config.weaponType, config.weaponName)}
                      alt={`${config.weaponType} ${displayName}`}
                      width={400}
                      height={180}
                      className="rounded object-contain w-full h-36 bg-gray-900"
                    />
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/70 to-transparent rounded-b" />
                    <div className="absolute inset-x-0 bottom-0 p-2">
                      <h3 className="text-sm font-semibold truncate">{displayName}</h3>
                    </div>
                  </div>
                  <div className="flex gap-2 mb-2">
                    <Badge
                      variant="secondary"
                      className="whitespace-pre-line leading-tight text-center"
                    >
                      {(() => {
                        const raw = config.weaponType || '';
                        const key = raw.toLowerCase().replace(/\s+/g, '');
                        if (key === 'subametralladora' || raw.toLowerCase().includes('sub ametralladora')) {
                          return 'Sub\nAmetralladora';
                        }
                        return raw;
                      })()}
                    </Badge>
                    <Badge>{config.gameMode}</Badge>
                  </div>
                  <p className="text-sm text-gray-300 mb-2">Por {config.username}</p>
                  <div className="mb-2">
                    <span className="text-xs text-gray-400">Alcance:</span>{' '}
                    <span className="text-sm">{getSafeRangeType(config.rangeType).join(', ')}</span>
                  </div>
                  <div className="mb-4">
                    <span className="text-xs text-gray-400">Código:</span>{' '}
                    <span className="font-mono bg-gray-700 px-2 py-1 rounded text-sm break-all whitespace-normal inline-block max-w-full">
                      {config.weaponCode}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <Button
                      onClick={() => handleCopy(config.weaponCode, index, config.id!)}
                      size="lg"
                      className="w-full h-14 text-xl rounded-xl bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-500 text-black shadow-[0_10px_25px_-10px_rgba(247,197,53,0.9)] hover:from-amber-300 hover:to-yellow-400 hover:scale-[1.01] active:scale-100 transition-all"
                      aria-label="Copiar código del arma"
                    >
                      {copiedIndex === index ? '¡Copiado!' : 'Copiar Código'}
                    </Button>
                    <p className="text-xs text-gray-400 text-center">Copiado {config.copy_count || 0} veces</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )})}
        </div>
      )}
    </div>
  );
};

export default WeaponList;
