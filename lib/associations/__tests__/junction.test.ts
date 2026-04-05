import { describe, it, expect } from 'vitest';
import { getJunctionTable, TYPE_TO_COL } from '../junction';

describe('getJunctionTable', () => {
  it('institution + theme → institution_theme を返す', () => {
    expect(getJunctionTable('institution', 'theme')).toBe('institution_theme');
  });

  it('theme + institution → institution_theme を返す（順序不問）', () => {
    expect(getJunctionTable('theme', 'institution')).toBe('institution_theme');
  });

  it('institution + investor → institution_investor を返す', () => {
    expect(getJunctionTable('institution', 'investor')).toBe('institution_investor');
  });

  it('investor + institution → institution_investor を返す（順序不問）', () => {
    expect(getJunctionTable('investor', 'institution')).toBe('institution_investor');
  });

  it('theme + investor → theme_investor を返す', () => {
    expect(getJunctionTable('theme', 'investor')).toBe('theme_investor');
  });

  it('investor + theme → theme_investor を返す（順序不問）', () => {
    expect(getJunctionTable('investor', 'theme')).toBe('theme_investor');
  });

  it('同一タイプどうし → null を返す', () => {
    expect(getJunctionTable('institution', 'institution')).toBeNull();
    expect(getJunctionTable('theme', 'theme')).toBeNull();
    expect(getJunctionTable('investor', 'investor')).toBeNull();
  });
});

describe('TYPE_TO_COL', () => {
  it('institution → institution_id', () => {
    expect(TYPE_TO_COL.institution).toBe('institution_id');
  });

  it('theme → theme_id', () => {
    expect(TYPE_TO_COL.theme).toBe('theme_id');
  });

  it('investor → investor_id', () => {
    expect(TYPE_TO_COL.investor).toBe('investor_id');
  });
});
