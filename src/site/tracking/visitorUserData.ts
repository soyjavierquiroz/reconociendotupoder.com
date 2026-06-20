import type { VisitorData } from '../../core/visitor/types';

export interface VisitorOrderMetadata {
  visitor: {
    ip: string;
    country: string;
    countryName: string;
    userAgent: string;
  };
  client_ip_address: string;
  client_user_agent: string;
  visitor_country: string;
  visitor_country_name: string;
}

export interface VisitorCapiUserData extends Record<string, unknown> {
  client_ip_address: string;
  client_user_agent: string;
}

function cleanVisitorValue(value: string | null | undefined): string {
  return value?.trim() ?? '';
}

export function getClientUserAgent(): string {
  if (typeof window === 'undefined') {
    return '';
  }

  return window.navigator?.userAgent ?? '';
}

export function buildVisitorCapiUserData(
  visitorData: VisitorData | null | undefined,
): VisitorCapiUserData {
  return {
    client_ip_address: cleanVisitorValue(visitorData?.ip),
    client_user_agent: getClientUserAgent(),
  };
}

export function buildVisitorOrderMetadata(
  visitorData: VisitorData | null | undefined,
): VisitorOrderMetadata {
  const ip = cleanVisitorValue(visitorData?.ip);
  const country = cleanVisitorValue(visitorData?.country_code);
  const countryName = cleanVisitorValue(visitorData?.country_name);
  const userAgent = getClientUserAgent();

  return {
    visitor: {
      ip,
      country,
      countryName,
      userAgent,
    },
    client_ip_address: ip,
    client_user_agent: userAgent,
    visitor_country: country,
    visitor_country_name: countryName,
  };
}
