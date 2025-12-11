import { NextRequest } from 'next/server';

export function checkAdminAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.error('🔐 [AUTH] No authorization header or invalid format');
    return false;
  }

  const token = authHeader.substring(7);
  const adminPassword = process.env.ADMIN_PASSWORD || process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

  console.log('🔐 [AUTH] Checking credentials...');
  console.log('🔐 [AUTH] Token received (first 5 chars):', token.substring(0, 5) + '...');
  console.log('🔐 [AUTH] Expected password (first 5 chars):', adminPassword?.substring(0, 5) + '...');

  if (!adminPassword) {
    console.error('🔐 [AUTH] ADMIN_PASSWORD not set in environment variables');
    return false;
  }

  const isValid = token === adminPassword;
  console.log('🔐 [AUTH] Authentication result:', isValid ? '✅ SUCCESS' : '❌ FAILED');

  return isValid;
}

export function unauthorizedResponse() {
  return new Response(
    JSON.stringify({ success: false, error: 'Unauthorized' }),
    {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    }
  );
}
