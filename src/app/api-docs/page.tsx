'use client'

/**
 * Swagger UI Page
 * Displays interactive API documentation
 */

import dynamic from 'next/dynamic'
import 'swagger-ui-react/swagger-ui.css'

const SwaggerUI = dynamic(() => import('swagger-ui-react'), { ssr: false })

export default function ApiDocsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Taller Pro CR - API Documentation</h1>
          <p className="text-gray-600 mt-2">
            Interactive API documentation for the Workshop Management System
          </p>
        </div>
        <SwaggerUI url="/api/docs" />
      </div>
    </div>
  )
}
