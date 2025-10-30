import { NextResponse } from 'next/server'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

// POST /api/migrate/reset - Drop all tables and run migrations from scratch
export async function POST() {
  try {
    console.log('Resetting database...')
    
    // This will drop all tables and reapply migrations
    const { stdout, stderr } = await execAsync('npx prisma migrate reset --force --skip-generate')
    
    console.log('Reset output:', stdout)
    if (stderr) {
      console.error('Reset stderr:', stderr)
    }

    return NextResponse.json({
      success: true,
      message: 'Database reset and migrations applied successfully',
      output: stdout
    })
  } catch (error: unknown) {
    console.error('Reset error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    const errorOutput = (error as { stdout?: string }).stdout || ''
    const errorStderr = (error as { stderr?: string }).stderr || ''
    
    return NextResponse.json(
      {
        error: 'Reset failed',
        message: errorMessage,
        output: errorOutput,
        stderr: errorStderr
      },
      { status: 500 }
    )
  }
}

// GET /api/migrate/reset - Check what tables exist
export async function GET() {
  try {
    console.log('Checking database tables...')
    
    // Use Prisma to introspect the database
    const { stdout } = await execAsync('npx prisma db execute --stdin <<< "SHOW TABLES;"')
    
    return NextResponse.json({
      success: true,
      tables: stdout
    })
  } catch (error: unknown) {
    console.error('Check tables error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    const errorOutput = (error as { stdout?: string }).stdout || ''
    const errorStderr = (error as { stderr?: string }).stderr || ''
    
    return NextResponse.json(
      {
        error: 'Failed to check tables',
        message: errorMessage,
        output: errorOutput,
        stderr: errorStderr
      },
      { status: 500 }
    )
  }
}

