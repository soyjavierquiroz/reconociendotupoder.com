import { afterEach, describe, expect, it, vi } from 'vitest';
import { getMetaBrowserIds } from './metaBrowserIds';

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('getMetaBrowserIds', () => {
  it('reads _fbp from cookies', () => {
    vi.stubGlobal('window', {});
    vi.stubGlobal('document', {
      cookie: '_fbp=fb.1.1710000000000.1234567890',
    });

    expect(getMetaBrowserIds()).toEqual({
      fbp: 'fb.1.1710000000000.1234567890',
      fbc: '',
    });
  });

  it('reads _fbc from cookies', () => {
    vi.stubGlobal('window', {});
    vi.stubGlobal('document', {
      cookie: '_fbc=fb.1.1710000000000.fb-test',
    });

    expect(getMetaBrowserIds('ignored-fbclid')).toEqual({
      fbp: '',
      fbc: 'fb.1.1710000000000.fb-test',
    });
  });

  it('creates fbc from the original fbclid when _fbc is missing', () => {
    vi.spyOn(Date, 'now').mockReturnValue(1710000000000);
    vi.stubGlobal('window', {});
    vi.stubGlobal('document', { cookie: '_fbp=fb.1.1710000000000.1234567890' });

    expect(getMetaBrowserIds('TEST_FULL_EMQ_001')).toEqual({
      fbp: 'fb.1.1710000000000.1234567890',
      fbc: 'fb.1.1710000000000.TEST_FULL_EMQ_001',
    });
  });

  it('returns an empty fbc when fbclid is empty', () => {
    vi.stubGlobal('window', {});
    vi.stubGlobal('document', { cookie: '' });

    expect(getMetaBrowserIds('')).toEqual({
      fbp: '',
      fbc: '',
    });
  });

  it('does not invent fbc without _fbc or fbclid', () => {
    vi.stubGlobal('window', {});
    vi.stubGlobal('document', { cookie: '' });

    expect(getMetaBrowserIds()).toEqual({
      fbp: '',
      fbc: '',
    });
  });

  it('returns empty strings outside the browser', () => {
    expect(getMetaBrowserIds('fb-test')).toEqual({
      fbp: '',
      fbc: '',
    });
  });
});
