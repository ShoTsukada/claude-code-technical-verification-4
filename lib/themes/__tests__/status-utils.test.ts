import { describe, it, expect } from 'vitest';
import {
  STATUS_LABELS,
  getStatusTransitions,
  isValidStatus,
} from '../status-utils';

describe('STATUS_LABELS', () => {
  it('active のラベルが「進行中」である', () => {
    expect(STATUS_LABELS.active).toBe('進行中');
  });

  it('completed のラベルが「完了」である', () => {
    expect(STATUS_LABELS.completed).toBe('完了');
  });

  it('pending のラベルが「保留」である', () => {
    expect(STATUS_LABELS.pending).toBe('保留');
  });
});

describe('getStatusTransitions', () => {
  it('active から変更できるステータスに completed と pending が含まれる', () => {
    const transitions = getStatusTransitions('active');
    expect(transitions).toContain('completed');
    expect(transitions).toContain('pending');
    expect(transitions).not.toContain('active');
  });

  it('completed から変更できるステータスに active と pending が含まれる', () => {
    const transitions = getStatusTransitions('completed');
    expect(transitions).toContain('active');
    expect(transitions).toContain('pending');
    expect(transitions).not.toContain('completed');
  });

  it('pending から変更できるステータスに active と completed が含まれる', () => {
    const transitions = getStatusTransitions('pending');
    expect(transitions).toContain('active');
    expect(transitions).toContain('completed');
    expect(transitions).not.toContain('pending');
  });

  it('現在のステータス自身は遷移先に含まれない', () => {
    for (const status of ['active', 'completed', 'pending'] as const) {
      expect(getStatusTransitions(status)).not.toContain(status);
    }
  });
});

describe('isValidStatus', () => {
  it('active は有効', () => {
    expect(isValidStatus('active')).toBe(true);
  });

  it('completed は有効', () => {
    expect(isValidStatus('completed')).toBe(true);
  });

  it('pending は有効', () => {
    expect(isValidStatus('pending')).toBe(true);
  });

  it('不正な文字列は無効', () => {
    expect(isValidStatus('unknown')).toBe(false);
    expect(isValidStatus('')).toBe(false);
  });
});
