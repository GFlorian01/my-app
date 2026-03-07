import React, { useState } from 'react';
import { parseWeaponCode } from '../lib/weaponParsing';

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
  const [gameMode, setGameMode] = useState('Conflicto Bélico');
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
    <form onSubmit={handleSubmit} className="bg-gray-700 p-8 rounded-lg shadow-lg max-w-md mx-auto">
      <h4 className="text-2xl font-bold mb-6 text-center text-yellow-400">Nueva Configuración</h4>
      <div className="mb-4">
        <label htmlFor="username" className="block text-sm font-medium mb-2">Nombre de Usuario:</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="w-full p-3 bg-gray-600 border border-gray-500 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="weaponCode" className="block text-sm font-medium mb-2">Código del Arma:</label>
        <input
          type="text"
          id="weaponCode"
          value={weaponCode}
          onChange={handleWeaponCodeChange}
          required
          className="w-full p-3 bg-gray-600 border border-gray-500 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
          placeholder="Ej: Fusil de Asalto MCX LT-Operación: Extracción-6JAOB2K0DG7QNAIJM37DJ"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="weaponType" className="block text-sm font-medium mb-2">Tipo de Arma (autorellenado):</label>
        <input
          type="text"
          id="weaponType"
          value={weaponType}
          readOnly
          className="w-full p-3 bg-gray-500 border border-gray-400 rounded cursor-not-allowed"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="weaponName" className="block text-sm font-medium mb-2">Nombre del Arma (autorellenado):</label>
        <input
          type="text"
          id="weaponName"
          value={weaponName}
          readOnly
          className="w-full p-3 bg-gray-500 border border-gray-400 rounded cursor-not-allowed"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="gameMode" className="block text-sm font-medium mb-2">Modo de Juego (autorellenado):</label>
        <select
          id="gameMode"
          value={gameMode}
          disabled
          className="w-full p-3 bg-gray-500 border border-gray-400 rounded cursor-not-allowed"
        >
          <option value="Conflicto Bélico">Conflicto Bélico</option>
          <option value="Operaciones">Operaciones</option>
          <option value="Operación: Extracción">Operación: Extracción</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Tipo de Alcance (selección múltiple):</label>
        <div className="space-y-2">
          {['Corto Alcance', 'Medio Alcance', 'Largo Alcance'].map(range => (
            <label key={range} className="flex items-center">
              <input
                type="checkbox"
                checked={rangeType.includes(range)}
                onChange={(e) => handleRangeChange(range, e.target.checked)}
                className="mr-2"
              />
              {range}
            </label>
          ))}
        </div>
      </div>
      <button type="submit" className="tap-button w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-4 rounded transition duration-300">
        Compartir Configuración
      </button>
    </form>
  );
};

export default WeaponForm;
