/**
 * Swagger API Documentation Endpoint
 * GET /api/docs - Returns OpenAPI JSON specification
 */

import { NextResponse } from 'next/server'
import swaggerJsdoc from 'swagger-jsdoc'
import { swaggerConfig } from '@/lib/swagger/config'

export async function GET() {
  const swaggerSpec = swaggerJsdoc(swaggerConfig)
  return NextResponse.json(swaggerSpec)
}
