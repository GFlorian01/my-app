import test from 'node:test';
import assert from 'node:assert/strict';
import { getWeaponImagePath, parseWeaponCode, __listArmsFiles } from './weaponParsing.js';
import fs from 'node:fs';
import path from 'node:path';

test('parsea G18 como pistola con modo Operaciones', () => {
  const result = parseWeaponCode('G18-Operación: Extracción-6JB3F580DG7QNAIJM37DJ');
  assert.equal(result.weaponType, 'Pistola');
  assert.equal(result.weaponName, 'G18');
  assert.equal(result.gameMode, 'Operaciones');
  assert.equal(result.isValid, true);
});

test('parsea CI-19 completo y modo Operaciones', () => {
  const result = parseWeaponCode('Fusil de asalto CI-19-Operación: Extracción-6JB3G4K0DG7QNAIJM37DJ');
  assert.equal(result.weaponType, 'fusil de asalto');
  assert.equal(result.weaponName, 'CI-19');
  assert.equal(result.gameMode, 'Operaciones');
  assert.equal(result.isValid, true);
});

test('normaliza Fusil de Asalto a fusil de asalto', () => {
  const result = parseWeaponCode('Fusil de Asalto K437-Operación: Extracción-6JB3J4K0DG7QNAIJM37DJ');
  assert.equal(result.weaponType, 'fusil de asalto');
  assert.equal(result.weaponName, 'K437');
  assert.equal(result.gameMode, 'Operaciones');
  assert.equal(result.isValid, true);
});

test('parsea Desert Eagle como pistola', () => {
  const result = parseWeaponCode('Desert Eagle-Operación: Extracción-6JB3HMS0DG7QNAIJM37DJ');
  assert.equal(result.weaponType, 'Pistola');
  assert.equal(result.weaponName, 'Desert Eagle');
  assert.equal(result.gameMode, 'Operaciones');
  assert.equal(result.isValid, true);
});

test('parsea Revólver .357 como pistola', () => {
  const result = parseWeaponCode('Revólver .357-Operación: Extracción-6JB3HS80DG7QNAIJM37DJ');
  assert.equal(result.weaponType, 'Pistola');
  assert.equal(result.weaponName, 'Revólver .357');
  assert.equal(result.gameMode, 'Operaciones');
  assert.equal(result.isValid, true);
});

test('mapea Warfare y Conflicto a Operaciones', () => {
  const result = parseWeaponCode('Fuzil de combate M7-Conflicto Bélico-6I0B15G0EOJQS9KCRND3K');
  assert.equal(result.weaponType, 'fusil de asalto');
  assert.equal(result.weaponName, 'M7');
  assert.equal(result.gameMode, 'Operaciones');
  assert.equal(result.isValid, true);
});

test('acepta formato en inglés para Assault Rifle', () => {
  const result = parseWeaponCode('MK47 Assault Rifle-Operations-6J38KOC088K38R05C0LGG');
  assert.equal(result.weaponType, 'fusil de asalto');
  assert.equal(result.weaponName, 'MK47');
  assert.equal(result.gameMode, 'Operaciones');
  assert.equal(result.isValid, true);
});

test('acepta Warfare como Operaciones', () => {
  const result = parseWeaponCode('M7 Battle Rifle-Warfare-6I0B15G0EOJQS9KCRND3K');
  assert.equal(result.weaponType, 'fusil de asalto');
  assert.equal(result.weaponName, 'M7');
  assert.equal(result.gameMode, 'Operaciones');
  assert.equal(result.isValid, true);
});

test('normaliza nombres visibles específicos', () => {
  const mcx = parseWeaponCode('Fusil de asalto MCX LT-Operación: Extracción-6JB3X4K0DG7QNAIJM37DJ');
  assert.equal(mcx.weaponName, 'MCX LT');
  const sr = parseWeaponCode('Fusil de asalto compacto SR-3M-Operación: Extracción-6JB3Y4K0DG7QNAIJM37DJ');
  assert.equal(sr.weaponName, 'SR-3M');
  const m7 = parseWeaponCode('Fusil de batalla M7-Operación: Extracción-6JB3Z4K0DG7QNAIJM37DJ');
  assert.equal(m7.weaponName, 'M7');
  const ash = parseWeaponCode('Fusil de batalla ASh-12-Operación: Extracción-6JB3W4K0DG7QNAIJM37DJ');
  assert.equal(ash.weaponName, 'ASh-12');
});

test('mapea imágenes para 20 combinaciones', () => {
  const cases = [
    ['fusil de asalto', 'AKM', '/arms/FA_AKM.png'],
    ['Fusil de Asalto', 'K437', '/arms/FA_K437.png'],
    ['fusil de asalto', 'CI-19', '/arms/FA_CI-19.png'],
    ['fusil de asalto', 'QBZ-95-1', '/arms/FA_QBZ-95-1.png'],
    ['fusil de asalto', 'SCAR-H', '/arms/FA_SCAR-H.png'],
    ['fusil de asalto', 'MXC LT', '/arms/FA_MCX_LT.png'],
    ['fusil de asalto', 'SG 552', '/arms/FA_SG_552.png'],
    ['Sub Ametralladora', 'SR-3M', '/arms/FAC_SR-3M.png'],
    ['subfusil', 'MP7', '/arms/Sub_MP7.png'],
    ['Subametralladora', 'SMG-45', '/arms/Sub_SMG-45.png'],
    ['Subfusil', 'QCQ171', '/arms/Sub_QCQ171.png'],
    ['pistola', 'G18', '/arms/P_G18.png'],
    ['Pistola', 'Desert   Eagle', '/arms/P_Desert_Eagle.png'],
    ['Revólver', '.357', '/arms/R_.357.png'],
    ['Escopeta', 'M1014', '/arms/Esc_M1014.png'],
    ['Escopeta', 'FS-12', '/arms/Esc_FS-12.png'],
    ['Francotirador', 'R93', '/arms/FF_R93.png'],
    ['Fusil de tirador', 'SR-25', '/arms/FT_SR-25.png'],
    ['Ametralladora Ligera', 'M249', '/arms/AL_M249.png'],
    ['Ametralladora general', 'M250', '/arms/AG_M250.png'],
    ['fusil de asalto', 'MCX LT', '/arms/FA_MCX_LT.png'],
    ['Fusil de batalla', 'ASh-12', '/arms/FA_ASh-12.png'],
    ['fusil de asalto', 'SR-3M', '/arms/FAC_SR-3M.png'],
    ['Fusil de batalla', 'M7', '/arms/FA_M7.png'],
    ['Arco', 'compuesto', '/arms/Arco.png'],
  ];

  for (const [type, name, expected] of cases) {
    const result = getWeaponImagePath(type, name);
    assert.equal(result, expected);
  }
});

test('SR-3M variantes mapean a FAC_SR-3M.png', () => {
  const variants = [
    ['Sub Ametralladora', 'SR-3M'],
    ['subfusil', 'SR-3M'],
    ['Sub Ametralladora', 'sr-3m'],
    ['Sub Ametralladora', 'sr3m'],
  ];
  for (const [type, name] of variants) {
    const result = getWeaponImagePath(type, name);
    assert.equal(result, '/arms/FAC_SR-3M.png');
  }
});
test('archivos listados coinciden con public/arms', () => {
  const listed = new Set(__listArmsFiles().map(f => f.toLowerCase()));
  const dir = path.join(process.cwd(), 'public', 'arms');
  const onDisk = new Set(fs.readdirSync(dir).map(f => f.toLowerCase()));
  assert.equal(listed.size, onDisk.size);
  for (const f of listed) {
    assert.ok(onDisk.has(f), `Falta en public/arms: ${f}`);
  }
});
