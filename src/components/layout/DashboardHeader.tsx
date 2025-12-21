'use client'

import Link from 'next/link'
import { useState } from 'react'

/**
 * Dashboard Header Component
 * 
 * Main navigation header for the dashboard
 * Includes logo, search bar, and user menu
 */

export function DashboardHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
            <span className="text-sm font-bold text-white">TC</span>
          </div>
          <span className="hidden font-semibold text-gray-900 sm:inline">
            Taller Pro CR
          </span>
        </Link>

        {/* Search Bar - Hidden on mobile */}
        <div className="hidden flex-1 max-w-md mx-4 md:block">
          <input
            type="search"
            placeholder="Buscar órdenes, vehículos..."
            className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-sm placeholder-gray-500 focus:border-blue-500 focus:bg-white focus:outline-none"
          />
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Mobile Search Button */}
          <button className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>

          {/* Notifications */}
          <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
          </button>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center gap-2 p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-semibold">
                U
              </div>
              <svg
                className={`h-4 w-4 transition-transform ${
                  isMenuOpen ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-lg border border-gray-200 bg-white shadow-lg">
                <Link
                  href="/dashboard/perfil"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 first:rounded-t-lg"
                >
                  Mi Perfil
                </Link>
                <Link
                  href="/dashboard/configuracion"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  Configuración
                </Link>
                <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 last:rounded-b-lg border-t border-gray-200">
                  Cerrar Sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
