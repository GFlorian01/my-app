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
  features: string[];
  priceRange: string;
};

const WeaponForm = ({ onSubmit }: { onSubmit: (data: WeaponFormData) => void }) => {
  const [username, setUsername] = useState('');
  const [weaponCode, setWeaponCode] = useState('');
  const [weaponType, setWeaponType] = useState('');
  const [weaponName, setWeaponName] = useState('');
  const [gameMode, setGameMode] = useState('Operaciones');
  const [rangeType, setRangeType] = useState<string[]>([]);
  const [features, setFeatures] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<string>('');

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
  const handleFeatureChange = (feat: string, checked: boolean) => {
    if (checked) setFeatures([...features, feat]);
    else setFeatures(features.filter(f => f !== feat));
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
    if (!priceRange) {
      alert('Selecciona un rango de precio para la build.');
      return;
    }
    onSubmit({ username, weaponCode, weaponType, weaponName, gameMode, rangeType, features, priceRange });
    setUsername('');
    setWeaponCode('');
    setWeaponType('');
    setWeaponName('');
    setGameMode('Operaciones');
    setRangeType([]);
    setFeatures([]);
    setPriceRange('');
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
              <Input id="gameMode" value={gameMode} readOnly className="cursor-not-allowed bg-gray-700/70" />
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
          <div>
            <label className="block text-sm font-medium mb-2">Características (múltiple)</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {['Fuego de cadera', 'Precisión', 'Velocidad de movimiento', 'Mira Punto', 'Mira x2', 'Mira x3-x5', 'Mira Zoom F.'].map(f => (
                <label key={f} className="flex items-center gap-2 text-sm">
                  <Checkbox
                    checked={features.includes(f)}
                    onChange={(e) => handleFeatureChange(f, (e.target as HTMLInputElement).checked)}
                  />
                  {f}
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Rango de Precio (único)</label>
            <Select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              required
            >
              <option value="" disabled>Selecciona un rango</option>
              <option value="≤150k">150k o menos</option>
              <option value="150k-250k">150k a 250k</option>
              <option value="250k-350k">250k a 350k</option>
              <option value="350k-500k">350k a 500k</option>
              <option value="500k-650k">500k a 650k</option>
              <option value="≥650k">650k o más</option>
            </Select>
          </div>
          <Button type="submit" size="lg" className="w-full">Compartir Configuración</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default WeaponForm;
