export type MetaBrowserIds = {
  fbp: string;
  fbc: string;
};

function readCookie(name: string): string {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return '';
  }

  const encodedName = `${name}=`;
  const cookie = document.cookie
    .split('; ')
    .find((part) => part.startsWith(encodedName));

  if (!cookie) {
    return '';
  }

  try {
    return decodeURIComponent(cookie.slice(encodedName.length));
  } catch {
    return '';
  }
}

export function getMetaBrowserIds(fbclid?: string): MetaBrowserIds {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return {
      fbp: '',
      fbc: '',
    };
  }

  const fbp = readCookie('_fbp');
  const cookieFbc = readCookie('_fbc');

  return {
    fbp,
    fbc: cookieFbc || (fbclid ? `fb.1.${Date.now()}.${fbclid}` : ''),
  };
}
