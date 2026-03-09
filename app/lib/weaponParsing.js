const CANONICAL_WEAPON_TYPES = [
  { key: 'fusil de asalto', label: 'fusil de asalto' },
  { key: 'fuzil de combate', label: 'fusil de asalto' },
  { key: 'fusil de batalla', label: 'fusil de asalto' },
  { key: 'subfusil', label: 'Sub Ametralladora' },
  { key: 'pistola', label: 'Pistola' },
  { key: 'escopeta', label: 'Escopeta' },
  { key: 'francotirador', label: 'Francotirador' },
  { key: 'ametralladora ligera', label: 'Ametralladora Ligera' },
  // Keys en inglés mapeadas a etiquetas canónicas en español
  { key: 'assault rifle', label: 'fusil de asalto' },
  { key: 'battle rifle', label: 'fusil de asalto' },
  { key: 'submachine gun', label: 'Sub Ametralladora' },
  { key: 'smg', label: 'Sub Ametralladora' },
  { key: 'pistol', label: 'Pistola' },
  { key: 'shotgun', label: 'Escopeta' },
  { key: 'sniper rifle', label: 'Francotirador' },
  { key: 'sniper', label: 'Francotirador' },
  { key: 'marksman rifle', label: 'Fusil de tirador' },
  { key: 'dmr', label: 'Fusil de tirador' },
  { key: 'light machine gun', label: 'Ametralladora Ligera' },
  { key: 'lmg', label: 'Ametralladora Ligera' },
  { key: 'general purpose machine gun', label: 'Ametralladora general' },
  { key: 'general-purpose machine gun', label: 'Ametralladora general' },
  { key: 'gpmg', label: 'Ametralladora general' },
  { key: 'bow', label: 'Arco' },
];

const ARMS_FILES = [
  'AG_M250.png',
  'AG_PKM.png',
  'AL_M249.png',
  'AL_QJB-201.png',
  'Arco.png',
  'Esc_725.png',
  'Esc_FS-12.png',
  'Esc_M1014.png',
  'Esc_M870.png',
  'Esc_S12k.png',
  'FAC_SR-3M.png',
  'FA_AK-12.png',
  'FA_AKM.png',
  'FA_AKS-74.png',
  'FA_ASVal.png',
  'FA_ASh-12.png',
  'FA_AUG.png',
  'FA_CAR-15.png',
  'FA_CI-19.png',
  'FA_G3.png',
  'FA_K416.png',
  'FA_K437.png',
  'FA_KC17.png',
  'FA_M16A4.png',
  'FA_M4A1.png',
  'FA_M7.png',
  'FA_MK47.png',
  'FA_MCX_LT.png',
  'FA_PTR-32.png',
  'FA_QBZ-95-1.png',
  'FA_SCAR-H.png',
  'FA_SG_552.png',
  'FF_AWM.png',
  'FF_M700.png',
  'FF_R93.png',
  'FF_SV-98.png',
  'FT_M14.png',
  'FT_Mini-14.png',
  'FT_PSG-1.png',
  'FT_SKS.png',
  'FT_SR-25.png',
  'FT_SR9.png',
  'FT_SVD.png',
  'FT_VSS.png',
  'FuP.png',
  'P_93R.png',
  'P_Desert_Eagle.png',
  'P_G17.png',
  'P_G18.png',
  'P_M1911.png',
  'P_QSZ-92G.png',
  'R_.357.png',
  'Sub_Bizon.png',
  'Sub_MK4.png',
  'Sub_MP5.png',
  'Sub_MP7.png',
  'Sub_P90.png',
  'Sub_QCQ171.png',
  'Sub_SMG-45.png',
  'Sub_UZI.png',
  'Sub_Vector.png',
  'Sub_Vityaz.png',
];

const ARMS_FILE_MAP = ARMS_FILES.reduce((acc, file) => {
  acc[file.toLowerCase()] = file;
  return acc;
}, {});

export const __listArmsFiles = () => Object.values(ARMS_FILE_MAP);

const PISTOL_ONLY_NAMES = ['g18', 'desert eagle', 'revólver .357', 'revolver .357'];

const normalizeKey = (value) =>
  value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim();

const normalizeGameMode = (modePart) => {
  const normalized = normalizeKey(modePart);
  // Unificación: todo mapea a "Operaciones"
  const opsTokens = [
    'operations',
    'operation',
    'operaciones',
    'operacion',
    'operación',
    'extraccion',
    'extracción',
    'extraction',
    'conflicto',
    'warfare',
  ];
  if (opsTokens.some(t => normalized.includes(t))) {
    return 'Operaciones';
  }
  return 'Operaciones';
};

export const normalizeWeaponType = (weaponType) => {
  const normalized = normalizeKey(weaponType);
  const typeMap = {
    'fusil de asalto': 'fusil de asalto',
    'assault rifle': 'fusil de asalto',
    'battle rifle': 'fusil de asalto',
    'fuzil de combate': 'fusil de asalto',
    'fusil de batalla': 'fusil de asalto',
    'submachine gun': 'Sub Ametralladora',
    'smg': 'Sub Ametralladora',
    'subfusil': 'Sub Ametralladora',
    'subametralladora': 'Sub Ametralladora',
    'sub ametralladora': 'Sub Ametralladora',
    'pistol': 'Pistola',
    'pistola': 'Pistola',
    'shotgun': 'Escopeta',
    'escopeta': 'Escopeta',
    'sniper rifle': 'Francotirador',
    'sniper': 'Francotirador',
    'francotirador': 'Francotirador',
    'marksman rifle': 'Fusil de tirador',
    'dmr': 'Fusil de tirador',
    'fusil de tirador': 'Fusil de tirador',
    'light machine gun': 'Ametralladora Ligera',
    'lmg': 'Ametralladora Ligera',
    'ametralladora ligera': 'Ametralladora Ligera',
    'general purpose machine gun': 'Ametralladora general',
    'general-purpose machine gun': 'Ametralladora general',
    'gpmg': 'Ametralladora general',
    'ametralladora general': 'Ametralladora general',
    'bow': 'Arco',
    'arco': 'Arco',
  };
  if (typeMap[normalized]) return typeMap[normalized];
  return weaponType.trim();
};

export const normalizeWeaponDisplayName = (weaponName, weaponType = '') => {
  const rawName = (weaponName || '').trim();
  if (!rawName) return '';
  const normalizedName = normalizeKey(rawName);
  const normalizedType = normalizeKey(weaponType || '');

  let cleaned = rawName;
  if (normalizedType && normalizedName.startsWith(`${normalizedType} `)) {
    cleaned = rawName.slice(weaponType.length + 1).trim();
  }

  if (normalizeKey(cleaned).startsWith('compacto ')) {
    cleaned = cleaned.replace(/^compacto\s+/i, '').trim();
  }

  const normalizedClean = normalizeKey(cleaned);
  const overrides = {
    'mxc lt': 'MCX LT',
    'mcx lt': 'MCX LT',
    'sr-3m': 'SR-3M',
    'sr 3m': 'SR-3M',
    'm7': 'M7',
    'ash-12': 'ASh-12',
    'ash 12': 'ASh-12',
  };

  return overrides[normalizedClean] || cleaned;
};

const normalizeImageToken = (value) => {
  const normalized = normalizeKey(value)
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9._-]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_+|_+$/g, '');
  return normalized;
};

const typePrefixMap = {
  'fusil de asalto': 'FA',
  'fusil de combate': 'FAC',
  'subfusil': 'Sub',
  'subametralladora': 'Sub',
  'sub ametralladora': 'Sub',
  'sub ametralladora': 'Sub',
  'sub ametralladora': 'Sub',
  'sub ametralladora': 'Sub',
  'sub ametralladora': 'Sub',
  'sub ametralladora': 'Sub',
  'sub ametralladora': 'Sub',
  'sub ametralladora': 'Sub',
  'sub ametralladora': 'Sub',
  'sub ametralladora': 'Sub',
  'sub ametralladora': 'Sub',
  'sub ametralladora': 'Sub',
  'sub ametralladora': 'Sub',
  'sub ametralladora': 'Sub',
  'sub ametralladora': 'Sub',
  'sub ametralladora': 'Sub',
  'sub ametralladora': 'Sub',
  'sub ametralladora': 'Sub',
  'sub ametralladora': 'Sub',
  'sub ametralladora': 'Sub',
  'sub ametralladora': 'Sub',
  'sub ametralladora': 'Sub',
  'sub ametralladora': 'Sub',
  'sub ametralladora': 'Sub',
  'sub ametralladora': 'Sub',
  'sub ametralladora': 'Sub',
  'sub ametralladora': 'Sub',
  'sub ametralladora': 'Sub',
  'sub ametralladora': 'Sub',
  'sub ametralladora': 'Sub',
  'sub ametralladora': 'Sub',
  'sub ametralladora': 'Sub',
  'sub ametralladora': 'Sub',
  'sub ametralladora': 'Sub',
  'sub ametralladora': 'Sub',
  'sub ametralladora': 'Sub',
  'sub ametralladora': 'Sub',
  'sub ametralladora': 'Sub',
  'sub ametralladora': 'Sub',
  'sub ametralladora': 'Sub',
  'sub ametralladora': 'Sub',
  'pistola': 'P',
  'escopeta': 'Esc',
  'francotirador': 'FF',
  'fusil de francotirador': 'FF',
  'fusil de tirador': 'FT',
  'ametralladora ligera': 'AL',
  'ametralladora general': 'AG',
  'arco': 'Arco',
  'revolver': 'R',
  'revólver': 'R',
};

const resolveWeaponPrefix = (weaponType) => {
  const n = normalizeKey(weaponType);
  if (['fusil de asalto', 'assault rifle', 'fusil de batalla', 'battle rifle'].includes(n)) return 'FA';
  if (['fuzil de combate', 'fusil de combate'].includes(n)) return 'FAC';
  if (['subfusil', 'subametralladora', 'sub ametralladora', 'submachine gun', 'smg'].includes(n)) return 'Sub';
  if (['pistola', 'pistol'].includes(n)) return 'P';
  if (['escopeta', 'shotgun'].includes(n)) return 'Esc';
  if (['francotirador', 'sniper rifle', 'sniper', 'fusil de francotirador'].includes(n)) return 'FF';
  if (['fusil de tirador', 'marksman rifle', 'dmr'].includes(n)) return 'FT';
  if (['ametralladora ligera', 'light machine gun', 'lmg'].includes(n)) return 'AL';
  if (['ametralladora general', 'general purpose machine gun', 'general-purpose machine gun', 'gpmg'].includes(n)) return 'AG';
  if (['arco', 'bow'].includes(n)) return 'Arco';
  if (['revolver', 'revólver'].includes(n)) return 'R';
  return typePrefixMap[n] || '';
};

const buildNameVariants = (rawName) => {
  const token = normalizeImageToken(rawName);
  const noSeparators = token.replace(/[_-]/g, '');
  const withUnderscore = token.replace(/-/g, '_');
  const withDash = token.replace(/_/g, '-');
  const variants = [token, withUnderscore, withDash, noSeparators];
  return Array.from(new Set(variants.filter(Boolean)));
};

export const getWeaponImagePath = (weaponType, weaponName) => {
  const normalizedType = normalizeWeaponType(weaponType || '');
  const typeToken = normalizeImageToken(normalizedType);
  const prefix = resolveWeaponPrefix(normalizedType);
  const nameVariants = buildNameVariants(weaponName || '');
  const extensions = ['png', 'jpg', 'jpeg'];

  const nameKey = normalizeKey(weaponName || '');
  const directOverrides = {
    'mxc lt': 'FA_MCX_LT.png',
    'mcx lt': 'FA_MCX_LT.png',
    'ash-12': 'FA_ASh-12.png',
    'sr-3m': 'FAC_SR-3M.png',
    'sr3m': 'FAC_SR-3M.png',
    'm7': 'FA_M7.png',
  };
  if (directOverrides[nameKey]) {
    const file = directOverrides[nameKey];
    const matched = ARMS_FILE_MAP[file.toLowerCase()];
    if (matched) {
      const path = `/arms/${matched}`;
      console.debug('Weapon image direct override', { weaponType, weaponName, path });
      return path;
    }
  }
  if (nameKey === 'compuesto' && normalizeKey(weaponType) === 'arco') {
    const file = 'Arco.png';
    const matched = ARMS_FILE_MAP[file.toLowerCase()];
    if (matched) {
      const path = `/arms/${matched}`;
      console.debug('Weapon image arco compuesto override', { weaponType, weaponName, path });
      return path;
    }
  }

  const candidates = [];
  for (const nameVariant of nameVariants) {
    if (typeToken) {
      for (const ext of extensions) {
        candidates.push(`${typeToken}_${nameVariant}.${ext}`);
      }
    }
    if (prefix) {
      for (const ext of extensions) {
        candidates.push(`${prefix}_${nameVariant}.${ext}`);
      }
    }
  }

  for (const candidate of candidates) {
    const matched = ARMS_FILE_MAP[candidate.toLowerCase()];
    if (matched) {
      const path = `/arms/${matched}`;
      console.debug('Weapon image matched', {
        weaponType,
        weaponName,
        candidate,
        path,
      });
      return path;
    }
  }

  console.warn('Weapon image not found', {
    weaponType,
    weaponName,
  });
  return '/img/asalto_01.jpg';
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
    // Caso ES: "<tipo> <nombre>"
    if (normalized.startsWith(`${key} `)) {
      return {
        weaponType: label,
        weaponName: weaponPart.slice(key.length + 1).trim(),
      };
    }
    // Caso EN: "<nombre> <tipo>"
    if (normalized.endsWith(` ${key}`)) {
      const base = weaponPart.slice(0, weaponPart.length - key.length).trim();
      // Si el nombre quedó con espacios extra, simplemente usamos 'base'
      return {
        weaponType: label,
        weaponName: base,
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
  let normalizedWeaponType = normalizeWeaponType(weaponType);
  const normalizedWeaponName = normalizeWeaponDisplayName(weaponName, normalizedWeaponType);
  // Regla especial: SR-3M se clasifica como Sub Ametralladora
  if (normalizeKey(normalizedWeaponName) === 'sr-3m') {
    normalizedWeaponType = 'Sub Ametralladora';
  }
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
    weaponName: normalizedWeaponName,
    gameMode,
    codePart,
    isValid,
  };
};
