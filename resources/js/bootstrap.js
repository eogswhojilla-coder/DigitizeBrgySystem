import axios from 'axios';
window.axios = axios;

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
window.axios.defaults.withCredentials = true;
window.axios.defaults.withXSRFToken = true;

/**
 * Get XSRF token from cookie
 */
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

/**
 * Check if we have a valid CSRF cookie
 */
function hasValidCsrfCookie() {
    return getCookie('XSRF-TOKEN') !== null;
}

/**
 * Initialize CSRF protection for Laravel Sanctum
 * This must be called before making any authenticated requests
 */
let csrfInitialized = false;
let csrfInitPromise = null;

async function initializeCsrf() {
    if (csrfInitialized) {
        return Promise.resolve();
    }
    
    if (csrfInitPromise) {
        return csrfInitPromise;
    }
    
    csrfInitPromise = axios.get('/sanctum/csrf-cookie')
        .then(() => {
            csrfInitialized = true;
            console.log('[CSRF] Token initialized successfully');
        })
        .catch(error => {
            console.error('[CSRF] Failed to initialize token:', error);
            csrfInitialized = false;
            csrfInitPromise = null;
            throw error;
        });
    
    return csrfInitPromise;
}

// Initialize CSRF on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initializeCsrf();
    });
} else {
    initializeCsrf();
}

/**
 * Axios request interceptor
 * Ensures CSRF cookie is present before state-changing requests
 */
window.axios.interceptors.request.use(
    async function (config) {
        // For state-changing methods, ensure we have a CSRF cookie
        const stateChangingMethods = ['post', 'put', 'patch', 'delete'];
        const method = config.method?.toLowerCase();
        
        if (stateChangingMethods.includes(method) && !hasValidCsrfCookie()) {
            console.log('[CSRF] Cookie missing, initializing...');
            await initializeCsrf();
        }
        
        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);

/**
 * Axios response interceptor
 * Handle 419 CSRF token mismatch errors
 */
window.axios.interceptors.response.use(
    response => response,
    async error => {
        if (error.response && error.response.status === 419) {
            console.warn('[CSRF] Token mismatch detected (419). Reinitializing...');
            
            // Reset CSRF state
            csrfInitialized = false;
            csrfInitPromise = null;
            
            // Try to reinitialize and retry the request once
            if (!error.config._retry) {
                error.config._retry = true;
                
                try {
                    await initializeCsrf();
                    return axios.request(error.config);
                } catch (retryError) {
                    console.error('[CSRF] Retry failed, reloading page...');
                    window.location.reload();
                }
            } else {
                console.error('[CSRF] Retry already attempted, reloading page...');
                window.location.reload();
            }
        }
        
        return Promise.reject(error);
    }
);
