import React, { useState } from 'react';
import { Form } from '@remix-run/react';
import { useAuth } from './auth-provider';

interface UserMenuProps {
  className?: string;
}

export const UserMenu: React.FC<UserMenuProps> = ({ className = '' }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  if (!isAuthenticated() || !user) {
    return (
      <div className={className}>
        <a
          href="/login"
          className="text-sm font-medium text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md"
        >
          Sign In
        </a>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium mr-2">
          {user.Email?.charAt(0).toUpperCase() || 'U'}
        </div>
        <span className="hidden md:block">{user.Email}</span>
        <svg
          className="ml-1 h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Menu */}
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 border border-gray-200">
            <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
              <div className="font-medium">{user.Email}</div>
              {user.id && (
                <div className="text-xs text-gray-500">ID: {user.id}</div>
              )}
            </div>
            
            <a
              href="/profile"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setIsOpen(false)}
            >
              Profile
            </a>
            
            <a
              href="/settings"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setIsOpen(false)}
            >
              Settings
            </a>
            
            <div className="border-t border-gray-100">
              <Form method="post" action="/auth/logout">
                <button
                  type="submit"
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsOpen(false)}
                >
                  Sign Out
                </button>
              </Form>
            </div>
          </div>
        </>
      )}
    </div>
  );
}; 