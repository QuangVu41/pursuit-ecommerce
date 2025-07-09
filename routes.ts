// /**
//  * An array of routes that are accessible to the public
//  * These routes do not require authentication
//  * @type {string[]}
//  */
// export const publicRoutes = ['/'];

/**
 * An array of routes that are used for authentication
 * These routes will redirect login user to /settings
 * @type {string[]}
 */
export const authRoutes = ['/auth/signin', '/auth/signup'];

/**
 * The prefix for API authentication routes
 * Routes that start with this prefix are used for API authentication purposes
 * @type {string}
 */
export const apiAuthPrefix = '/api/auth';

/**
 * The default redirect path after logging in
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT = '/';

export const secretRoutes = ['/cart', '/billing', '/profile', '/payment', '/return', '/mng', '/orders'];
