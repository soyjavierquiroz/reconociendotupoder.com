import { afterEach, describe, expect, it, vi } from 'vitest';
import { initMicrosoftClarity } from './clarity';

type ScriptElementMock = {
  async: boolean;
  id: string;
  src: string;
};

function installBrowserMocks() {
  const scripts = new Map<string, ScriptElementMock>();
  const appendChild = vi.fn((script: ScriptElementMock) => {
    scripts.set(script.id, script);
    return script;
  });
  const documentMock = {
    createElement: vi.fn((): ScriptElementMock => ({ async: false, id: '', src: '' })),
    getElementById: vi.fn((id: string) => scripts.get(id) ?? null),
    head: { appendChild },
  };
  const windowMock: Window & typeof globalThis = {} as Window & typeof globalThis;

  vi.stubGlobal('window', windowMock);
  vi.stubGlobal('document', documentMock);

  return { appendChild, documentMock, scripts, windowMock };
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('initMicrosoftClarity', () => {
  it('does nothing when projectId is empty', () => {
    const { appendChild, windowMock } = installBrowserMocks();

    initMicrosoftClarity('  ');

    expect(appendChild).not.toHaveBeenCalled();
    expect(windowMock.clarity).toBeUndefined();
  });

  it('does nothing outside the browser', () => {
    expect(() => initMicrosoftClarity('x4tqk0ij4s')).not.toThrow();
  });

  it('inserts the async script with the correct URL', () => {
    const { appendChild, scripts } = installBrowserMocks();

    initMicrosoftClarity('x4tqk0ij4s');

    expect(appendChild).toHaveBeenCalledOnce();
    expect(scripts.get('microsoft-clarity-script')).toEqual({
      async: true,
      id: 'microsoft-clarity-script',
      src: 'https://www.clarity.ms/tag/x4tqk0ij4s',
    });
  });

  it('inserts the script on an organic route', () => {
    const { appendChild, windowMock } = installBrowserMocks();
    Object.assign(windowMock, { location: { pathname: '/no-le-escribas' } });

    initMicrosoftClarity('x4tqk0ij4s');

    expect(appendChild).toHaveBeenCalledOnce();
  });

  it('does not insert the script twice', () => {
    const { appendChild } = installBrowserMocks();

    initMicrosoftClarity('x4tqk0ij4s');
    initMicrosoftClarity('x4tqk0ij4s');

    expect(appendChild).toHaveBeenCalledOnce();
  });

  it('creates a queue-compatible window.clarity function', () => {
    const { windowMock } = installBrowserMocks();

    initMicrosoftClarity('x4tqk0ij4s');
    windowMock.clarity?.('set', 'test-key', 'test-value');

    expect(windowMock.clarity).toBeTypeOf('function');
    expect(windowMock.clarity?.q).toHaveLength(1);
    expect(Array.from(windowMock.clarity!.q![0])).toEqual(['set', 'test-key', 'test-value']);
  });

  it.each(['abcd', 'invalid-id', 'invalid id', 'abc_123'])(
    'rejects invalid project id %s',
    (projectId) => {
      const { appendChild, windowMock } = installBrowserMocks();

      initMicrosoftClarity(projectId);

      expect(appendChild).not.toHaveBeenCalled();
      expect(windowMock.clarity).toBeUndefined();
    }
  );
});
