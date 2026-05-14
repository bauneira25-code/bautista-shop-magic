// Gate por PIN compartido para /admin y /admin/machine.
// PIN por defecto: "2580". Se puede cambiar en localStorage 'neiba-admin-pin'.

const KEY_AUTH = "neiba-admin-authed";
const KEY_PIN = "neiba-admin-pin";
export const DEFAULT_PIN = "2580";

export function getAdminPin(): string {
  if (typeof window === "undefined") return DEFAULT_PIN;
  return localStorage.getItem(KEY_PIN) || DEFAULT_PIN;
}

export function isAdminAuthed(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(KEY_AUTH) === "1";
}

export function tryAdminLogin(pin: string): boolean {
  if (pin === getAdminPin()) {
    localStorage.setItem(KEY_AUTH, "1");
    return true;
  }
  return false;
}

export function adminLogout() {
  localStorage.removeItem(KEY_AUTH);
}
