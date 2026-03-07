const CANONICAL_WEAPON_TYPES = [
  { key: 'fusil de asalto', label: 'fusil de asalto' },
  { key: 'fuzil de combate', label: 'Fuzil de combate' },
  { key: 'subfusil', label: 'Subfusil' },
  { key: 'pistola', label: 'Pistola' },
  { key: 'escopeta', label: 'Escopeta' },
  { key: 'francotirador', label: 'Francotirador' },
  { key: 'ametralladora ligera', label: 'Ametralladora Ligera' },
];

const PISTOL_ONLY_NAMES = ['g18', 'desert eagle', 'revólver .357', 'revolver .357'];

const normalizeKey = (value) =>
  value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim();

const normalizeGameMode = (modePart) => {
  const normalized = normalizeKey(modePart);
  if (normalized.includes('operacion')) {
    if (normalized.includes('extraccion')) {
      return 'Operación: Extracción';
    }
    return 'Operaciones';
  }
  if (normalized.includes('conflicto')) {
    return 'Conflicto Bélico';
  }
  return modePart.trim();
};

export const normalizeWeaponType = (weaponType) => {
  const normalized = normalizeKey(weaponType);
  if (normalized === 'fusil de asalto') return 'fusil de asalto';
  return weaponType.trim();
};

const extractParts = (code) => {
  const trimmed = code.trim();
  const match = trimmed.match(/^(.*)-([^-]+)-([A-Z0-9]{15,})$/);
  if (!match) return null;
  return {
    weaponPart: match[1].trim(),
    modePart: match[2].trim(),
    codePart: match[3].trim(),
  };
};

const detectWeaponTypeAndName = (weaponPart) => {
  const normalized = normalizeKey(weaponPart);
  for (const { key, label } of CANONICAL_WEAPON_TYPES) {
    if (normalized.startsWith(`${key} `)) {
      return {
        weaponType: label,
        weaponName: weaponPart.slice(key.length + 1).trim(),
      };
    }
  }
  if (PISTOL_ONLY_NAMES.includes(normalized)) {
    return {
      weaponType: 'Pistola',
      weaponName: weaponPart.trim(),
    };
  }
  const lastSpaceIdx = weaponPart.lastIndexOf(' ');
  if (lastSpaceIdx > 0) {
    return {
      weaponType: weaponPart.slice(0, lastSpaceIdx).trim(),
      weaponName: weaponPart.slice(lastSpaceIdx + 1).trim(),
    };
  }
  return {
    weaponType: '',
    weaponName: weaponPart.trim(),
  };
};

/**
 * Formato esperado:
 * "<Tipo y nombre del arma>-<Modo de juego>-<Código>"
 * - El nombre del arma puede incluir guiones y números.
 * - El modo puede ser "Operación: Extracción" o "Conflicto Bélico".
 * - El código final es alfanumérico en mayúsculas con al menos 15 caracteres.
 */
export const parseWeaponCode = (code) => {
  const parts = extractParts(code);
  if (!parts) {
    console.debug('Weapon parsing failed: formato inválido', { code });
    return {
      weaponType: '',
      weaponName: '',
      gameMode: '',
      codePart: '',
      isValid: false,
    };
  }

  const { weaponPart, modePart, codePart } = parts;
  const { weaponType, weaponName } = detectWeaponTypeAndName(weaponPart);
  const normalizedWeaponType = normalizeWeaponType(weaponType);
  const gameMode = normalizeGameMode(modePart);
  const isValid =
    Boolean(weaponName) &&
    Boolean(gameMode) &&
    codePart.length >= 15 &&
    /^[A-Z0-9]+$/.test(codePart);

  console.debug('Weapon parsing result', {
    code,
    weaponPart,
    modePart,
    codePart,
    weaponType,
    weaponName,
    gameMode,
    isValid,
  });

  return {
    weaponType: normalizedWeaponType,
    weaponName,
    gameMode,
    codePart,
    isValid,
  };
};
