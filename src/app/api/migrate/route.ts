import { NextResponse } from 'next/server'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

// POST /api/migrate - Run database migrations
export async function POST() {
  try {
    // Run Prisma migrations
    console.log('Starting database migration...')
    const { stdout, stderr } = await execAsync('npx prisma migrate deploy')
    
    console.log('Migration output:', stdout)
    if (stderr) {
      console.error('Migration stderr:', stderr)
    }

    return NextResponse.json({
      success: true,
      message: 'Migrations completed successfully',
      output: stdout
    })
  } catch (error: unknown) {
    console.error('Migration error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    const errorOutput = (error as { stdout?: string }).stdout || ''
    const errorStderr = (error as { stderr?: string }).stderr || ''
    
    return NextResponse.json(
      {
        error: 'Migration failed',
        message: errorMessage,
        output: errorOutput,
        stderr: errorStderr
      },
      { status: 500 }
    )
  }
}

// GET /api/migrate - Check migration status
export async function GET() {
  try {
    // Check migration status
    const { stdout } = await execAsync('npx prisma migrate status')
    
    return NextResponse.json({
      success: true,
      status: stdout
    })
  } catch (error: unknown) {
    console.error('Migration status error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    const errorOutput = (error as { stdout?: string }).stdout || ''
    const errorStderr = (error as { stderr?: string }).stderr || ''
    
    return NextResponse.json(
      {
        error: 'Failed to check migration status',
        message: errorMessage,
        output: errorOutput,
        stderr: errorStderr
      },
      { status: 500 }
    )
  }
}

