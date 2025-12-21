import { NextResponse } from 'next/server'

interface HealthCheckResponse {
  status: 'healthy' | 'degraded' | 'unhealthy'
  timestamp: string
  version: string
  environment: string
  uptime: number
  checks: {
    [key: string]: 'ok' | 'pending' | 'error'
  }
}

const startTime = Date.now()

export async function GET() {
  const now = Date.now()
  const uptime = Math.floor((now - startTime) / 1000)

  const checks: { [key: string]: 'ok' | 'pending' | 'error' } = {
    api: 'ok',
    database: 'pending',
    cache: 'pending',
  }

  const failedChecks = Object.values(checks).filter((c) => c === 'error')
  const pendingChecks = Object.values(checks).filter((c) => c === 'pending')
  
  const status = failedChecks.length > 0 
    ? 'unhealthy' 
    : pendingChecks.length > 0 
    ? 'degraded' 
    : 'healthy'

  const response: HealthCheckResponse = {
    status,
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '0.1.0',
    environment: process.env.NODE_ENV || 'development',
    uptime,
    checks,
  }

  const statusCode = status === 'healthy' ? 200 : 503

  return NextResponse.json(response, { status: statusCode })
}

export async function HEAD() {
  return new NextResponse(null, { status: 200 })
}
