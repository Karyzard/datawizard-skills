export function getSessionFlag(key: string): boolean {
  try {
    return sessionStorage.getItem(key) === '1';
  } catch {
    return false;
  }
}

export function setSessionFlag(key: string): void {
  try {
    sessionStorage.setItem(key, '1');
  } catch {}
}

export function getPersistentFlag(key: string): boolean {
  try {
    return localStorage.getItem(key) === '1';
  } catch {
    return false;
  }
}

export function setPersistentFlag(key: string): void {
  try {
    localStorage.setItem(key, '1');
  } catch {}
}
