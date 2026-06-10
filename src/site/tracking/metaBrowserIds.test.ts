import { afterEach, describe, expect, it, vi } from 'vitest';
import { getMetaBrowserIds } from './metaBrowserIds';

afterEach(() => {
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

  it('creates fbc from fbclid when _fbc is missing', () => {
    vi.stubGlobal('window', {});
    vi.stubGlobal('document', { cookie: '_fbp=fb.1.1710000000000.1234567890' });

    expect(getMetaBrowserIds('fb-test')).toMatchObject({
      fbp: 'fb.1.1710000000000.1234567890',
      fbc: expect.stringMatching(/^fb\.1\.\d+\.fb-test$/),
    });
  });

  it('returns empty strings outside the browser', () => {
    expect(getMetaBrowserIds('fb-test')).toEqual({
      fbp: '',
      fbc: '',
    });
  });
});
