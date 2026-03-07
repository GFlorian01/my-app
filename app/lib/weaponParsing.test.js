import test from 'node:test';
import assert from 'node:assert/strict';
import { parseWeaponCode } from './weaponParsing.js';

test('parsea G18 como pistola con modo Operación: Extracción', () => {
  const result = parseWeaponCode('G18-Operación: Extracción-6JB3F580DG7QNAIJM37DJ');
  assert.equal(result.weaponType, 'Pistola');
  assert.equal(result.weaponName, 'G18');
  assert.equal(result.gameMode, 'Operación: Extracción');
  assert.equal(result.isValid, true);
});

test('parsea CI-19 completo y modo Operación: Extracción', () => {
  const result = parseWeaponCode('Fusil de asalto CI-19-Operación: Extracción-6JB3G4K0DG7QNAIJM37DJ');
  assert.equal(result.weaponType, 'Fusil de Asalto');
  assert.equal(result.weaponName, 'CI-19');
  assert.equal(result.gameMode, 'Operación: Extracción');
  assert.equal(result.isValid, true);
});

test('parsea Desert Eagle como pistola', () => {
  const result = parseWeaponCode('Desert Eagle-Operación: Extracción-6JB3HMS0DG7QNAIJM37DJ');
  assert.equal(result.weaponType, 'Pistola');
  assert.equal(result.weaponName, 'Desert Eagle');
  assert.equal(result.gameMode, 'Operación: Extracción');
  assert.equal(result.isValid, true);
});

test('parsea Revólver .357 como pistola', () => {
  const result = parseWeaponCode('Revólver .357-Operación: Extracción-6JB3HS80DG7QNAIJM37DJ');
  assert.equal(result.weaponType, 'Pistola');
  assert.equal(result.weaponName, 'Revólver .357');
  assert.equal(result.gameMode, 'Operación: Extracción');
  assert.equal(result.isValid, true);
});

test('mantiene compatibilidad con conflicto bélico', () => {
  const result = parseWeaponCode('Fuzil de combate M7-Conflicto Bélico-6I0B15G0EOJQS9KCRND3K');
  assert.equal(result.weaponType, 'Fuzil de combate');
  assert.equal(result.weaponName, 'M7');
  assert.equal(result.gameMode, 'Conflicto Bélico');
  assert.equal(result.isValid, true);
});
