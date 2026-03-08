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
        
        if (stateChangingMethods.includes(method)) {
            if (!hasValidCsrfCookie()) {
                console.log('[CSRF] Cookie missing, initializing...');
                csrfInitialized = false;
                csrfInitPromise = null;
                await initializeCsrf();
            }

            // Remove any manually set X-CSRF-TOKEN header — let the XSRF-TOKEN cookie handle it
            if (config.headers['X-CSRF-TOKEN']) {
                delete config.headers['X-CSRF-TOKEN'];
            }
        }
        
        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);

/**
 * Axios response interceptor
 * Handle 419 CSRF token mismatch errors by refreshing the cookie and retrying
 */
window.axios.interceptors.response.use(
    response => response,
    async error => {
        if (error.response && error.response.status === 419 && !error.config._retry) {
            console.warn('[CSRF] Token mismatch detected (419). Reinitializing...');
            error.config._retry = true;
            
            // Reset CSRF state and re-fetch cookie
            csrfInitialized = false;
            csrfInitPromise = null;
            
            try {
                await initializeCsrf();

                // For FormData requests, we can't re-read the body, 
                // but Axios with withXSRFToken will attach the fresh cookie automatically
                return axios.request(error.config);
            } catch (retryError) {
                console.error('[CSRF] Retry failed');
                return Promise.reject(retryError);
            }
        }
        
        return Promise.reject(error);
    }
);
