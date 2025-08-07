import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Testar se conseguimos importar o auth
    const { auth } = await import('@/auth')
    const session = await auth()
    
    return NextResponse.json({
      success: true,
      session: session,
      message: 'Auth module loaded successfully'
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Failed to load auth module'
    }, { status: 500 })
  }
}