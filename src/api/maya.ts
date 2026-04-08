import { API_BASE } from '../config/api';
import { api } from './client';

const mayaEnabled = import.meta.env.VITE_MAYA_ENABLED === 'true';

export function isMayaEnabled() {
  return mayaEnabled;
}

export function isMayaConfigured() {
  return mayaEnabled;
}

export async function sendMayaMessage(message: string) {
  if (!mayaEnabled) {
    throw new Error('Maya disabled');
  }

  return api('/api/v1/maya/message', {
    method: 'POST',
    body: JSON.stringify({ message }),
  });
}

export async function checkMayaHealth(signal?: AbortSignal) {
  if (!mayaEnabled) return false;

  try {
    await api('/api/v1/maya/health', { method: 'GET', signal });
    return true;
  } catch {
    return false;
  }
}

export function buildMayaWebSocketUrl(path: string) {
  if (!mayaEnabled) return null;

  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  if (API_BASE.startsWith('http://') || API_BASE.startsWith('https://')) {
    const httpUrl = new URL(API_BASE);
    const protocol = httpUrl.protocol === 'https:' ? 'wss:' : 'ws:';
    return `${protocol}//${httpUrl.host}${normalizedPath}`;
  }

  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  return `${protocol}//${window.location.host}${normalizedPath}`;
}
