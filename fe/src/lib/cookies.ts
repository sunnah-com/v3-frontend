/**
 * Utility functions for working with cookies
 */

/**
 * Get a cookie value by name
 * @param name The name of the cookie to get
 * @returns The cookie value or null if not found
 */
export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') {
    return null; // Return null if running on the server
  }

  const cookies = document.cookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    // Check if this cookie starts with the name we're looking for
    if (cookie.startsWith(name + '=')) {
      return decodeURIComponent(cookie.substring(name.length + 1));
    }
  }
  return null;
}

/**
 * Set a cookie with the given name and value
 * @param name The name of the cookie
 * @param value The value to set
 * @param options Optional cookie options
 */
export function setCookie(
  name: string,
  value: string,
  options: {
    path?: string;
    expires?: Date | number;
    maxAge?: number;
    domain?: string;
    secure?: boolean;
    httpOnly?: boolean;
    sameSite?: 'strict' | 'lax' | 'none';
  } = {}
): void {
  if (typeof document === 'undefined') {
    return; // Do nothing if running on the server
  }

  let cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

  if (options.path) {
    cookie += `; path=${options.path}`;
  }

  if (options.expires) {
    if (typeof options.expires === 'number') {
      const date = new Date();
      date.setTime(date.getTime() + options.expires * 1000);
      options.expires = date;
    }
    cookie += `; expires=${options.expires.toUTCString()}`;
  }

  if (options.maxAge) {
    cookie += `; max-age=${options.maxAge}`;
  }

  if (options.domain) {
    cookie += `; domain=${options.domain}`;
  }

  if (options.secure) {
    cookie += '; secure';
  }

  if (options.httpOnly) {
    cookie += '; httpOnly';
  }

  if (options.sameSite) {
    cookie += `; sameSite=${options.sameSite}`;
  }

  document.cookie = cookie;
}

/**
 * Remove a cookie by setting its expiration date to the past
 * @param name The name of the cookie to remove
 * @param options Optional cookie options
 */
export function removeCookie(
  name: string,
  options: {
    path?: string;
    domain?: string;
  } = {}
): void {
  setCookie(name, '', {
    ...options,
    expires: new Date(0), // Set expiration to the past
  });
}
