import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    message: 'Auth API is working',
    env: {
      GOOGLE_CLIENT_ID: !!process.env.GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET: !!process.env.GOOGLE_CLIENT_SECRET,
      AUTH_SECRET: !!process.env.AUTH_SECRET,
      NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    }
  })
}