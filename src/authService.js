import decode from 'jwt-decode';
const ID_TOKEN_KEY = 'id_token';
const ACCESS_TOKEN_KEY = 'access_token';
/**
 * When this function is called the user gets logged out
 */
export function logout() {
    clearIdToken();
    clearAccessToken();
    window.location.reload();
    // browserHistory.push('/');
}


export function getIdToken() {
    return localStorage.getItem(ID_TOKEN_KEY);
}

export function getAccessToken() {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
}

function clearIdToken() {
    localStorage.removeItem(ID_TOKEN_KEY);
}

function clearAccessToken() {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
}

// Get and store access_token in local storage
export function setAccessToken(token) {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
}

// Get and store id_token in local storage
export function setIdToken(id) {
    localStorage.setItem(ID_TOKEN_KEY, id);
}

export function isLoggedIn() {
    const idToken = getIdToken();
    return !!idToken && !isTokenExpired(idToken);
}

function getTokenExpirationDate(encodedToken) {
    const token = decode(encodedToken);
    if (!token.exp) {
        return null;
    }

    const date = new Date(0);
    date.setUTCSeconds(token.exp);

    return date;
}

function isTokenExpired(token) {
    const expirationDate = getTokenExpirationDate(token);
    return expirationDate < new Date();
}
