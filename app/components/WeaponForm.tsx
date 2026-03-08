import React, { useState } from 'react';
import { parseWeaponCode } from '../lib/weaponParsing';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import Input from './ui/input';
import Select from './ui/select';
import Checkbox from './ui/checkbox';
import Button from './ui/button';

type WeaponFormData = {
  username: string;
  weaponCode: string;
  weaponType: string;
  weaponName: string;
  gameMode: string;
  rangeType: string[];
};

const WeaponForm = ({ onSubmit }: { onSubmit: (data: WeaponFormData) => void }) => {
  const [username, setUsername] = useState('');
  const [weaponCode, setWeaponCode] = useState('');
  const [weaponType, setWeaponType] = useState('');
  const [weaponName, setWeaponName] = useState('');
  const [gameMode, setGameMode] = useState('Operaciones');
  const [rangeType, setRangeType] = useState<string[]>([]); // Array para múltiples selecciones

  const applyParsedWeapon = (code: string) => {
    const parsed = parseWeaponCode(code);
    if (!parsed.isValid) return;
    setWeaponType(parsed.weaponType);
    setWeaponName(parsed.weaponName);
    setGameMode(parsed.gameMode);
  };

  const handleWeaponCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setWeaponCode(value);
    if (value.includes('-') && value.split('-').length >= 3) {
      applyParsedWeapon(value);
    }
  };

  const handleRangeChange = (range: string, checked: boolean) => {
    if (checked) {
      setRangeType([...rangeType, range]);
    } else {
      setRangeType(rangeType.filter(r => r !== range));
    }
  };

  const isValidWeaponCode = (code: string) => {
    const parsed = parseWeaponCode(code);
    return parsed.isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidWeaponCode(weaponCode)) {
      alert('El código del arma no es válido. Asegúrate de copiar el código completo de una build real (formato: Tipo Nombre-Modo-Código20Caracteres).');
      return;
    }
    onSubmit({ username, weaponCode, weaponType, weaponName, gameMode, rangeType });
    setUsername('');
    setWeaponCode('');
    setWeaponType('');
    setWeaponName('');
    setGameMode('Conflicto Bélico');
    setRangeType([]);
  };

  return (
    <Card className="max-w-xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center text-yellow-400">Nueva Configuración</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium mb-2">Nombre de Usuario</label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Tu nombre o alias"
            />
          </div>
          <div>
            <label htmlFor="weaponCode" className="block text-sm font-medium mb-2">Código del Arma</label>
            <Input
              id="weaponCode"
              value={weaponCode}
              onChange={handleWeaponCodeChange}
              required
              placeholder="Fusil de Asalto MCX LT-Operación: Extracción-6JAO..."
            />
            <p className="mt-1 text-xs text-gray-400">Pega el código completo generado por el juego</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label htmlFor="weaponType" className="block text-sm font-medium mb-2">Tipo</label>
              <Input id="weaponType" value={weaponType} readOnly className="cursor-not-allowed bg-gray-700/70" />
            </div>
            <div>
              <label htmlFor="weaponName" className="block text-sm font-medium mb-2">Arma</label>
              <Input id="weaponName" value={weaponName} readOnly className="cursor-not-allowed bg-gray-700/70" />
            </div>
            <div>
              <label htmlFor="gameMode" className="block text-sm font-medium mb-2">Modo</label>
              <Select id="gameMode" value={gameMode} disabled>
                <option value="Operaciones">Operaciones</option>
              </Select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Tipo de Alcance</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {['Corto Alcance', 'Medio Alcance', 'Largo Alcance'].map(range => (
                <label key={range} className="flex items-center gap-2 text-sm">
                  <Checkbox
                    checked={rangeType.includes(range)}
                    onChange={(e) => handleRangeChange(range, (e.target as HTMLInputElement).checked)}
                  />
                  {range}
                </label>
              ))}
            </div>
          </div>
          <Button type="submit" size="lg" className="w-full">Compartir Configuración</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default WeaponForm;
