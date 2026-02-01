let authReady = false;

export function setAuthReady() {
    authReady = true;
}

export function isAuthReady() {
    return authReady;
}