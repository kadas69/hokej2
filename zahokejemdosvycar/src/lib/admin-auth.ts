import { NextRequest, NextResponse } from 'next/server'

export function verifyAdmin(request: NextRequest): NextResponse | null {
  const authHeader = request.headers.get('authorization')

  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return NextResponse.json(
      { error: 'Přístup odepřen.' },
      { status: 401, headers: { 'WWW-Authenticate': 'Basic realm="Admin"' } }
    )
  }

  const credentials = atob(authHeader.split(' ')[1])
  const [, password] = credentials.split(':')

  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json(
      { error: 'Nesprávné heslo.' },
      { status: 401 }
    )
  }

  return null
}
