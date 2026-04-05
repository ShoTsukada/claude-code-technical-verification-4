import { describe, it, expect } from 'vitest';
import { getStringField, extractInstitutionData } from '../form-utils';

describe('getStringField', () => {
  it('値がある場合はその文字列を返す', () => {
    const fd = new FormData();
    fd.append('name', '東京大学');
    expect(getStringField(fd, 'name')).toBe('東京大学');
  });

  it('空文字列の場合は undefined を返す', () => {
    const fd = new FormData();
    fd.append('name', '');
    expect(getStringField(fd, 'name')).toBeUndefined();
  });

  it('空白のみの場合は undefined を返す', () => {
    const fd = new FormData();
    fd.append('name', '   ');
    expect(getStringField(fd, 'name')).toBeUndefined();
  });

  it('キーが存在しない場合は undefined を返す', () => {
    const fd = new FormData();
    expect(getStringField(fd, 'name')).toBeUndefined();
  });

  it('前後の空白をトリムした値を返す', () => {
    const fd = new FormData();
    fd.append('name', '  東京大学  ');
    expect(getStringField(fd, 'name')).toBe('東京大学');
  });
});

describe('extractInstitutionData', () => {
  it('全フィールドを正しく抽出する', () => {
    const fd = new FormData();
    fd.append('name', '東京大学');
    fd.append('location', '東京都文京区');
    fd.append('description', '国立大学法人');
    fd.append('contact', 'info@u-tokyo.ac.jp');

    expect(extractInstitutionData(fd)).toEqual({
      name: '東京大学',
      location: '東京都文京区',
      description: '国立大学法人',
      contact: 'info@u-tokyo.ac.jp',
    });
  });

  it('空フィールドは undefined として扱う', () => {
    const fd = new FormData();
    fd.append('name', '東京大学');
    fd.append('location', '');
    fd.append('description', '');

    const result = extractInstitutionData(fd);
    expect(result.name).toBe('東京大学');
    expect(result.location).toBeUndefined();
    expect(result.description).toBeUndefined();
    expect(result.contact).toBeUndefined();
  });

  it('name が空の場合は undefined を返す（Zodで必須エラーになる）', () => {
    const fd = new FormData();
    fd.append('name', '');

    const result = extractInstitutionData(fd);
    expect(result.name).toBeUndefined();
  });
});
