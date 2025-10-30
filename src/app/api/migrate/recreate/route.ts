import { NextResponse } from 'next/server'
import { exec } from 'child_process'
import { promisify } from 'util'
import { rm } from 'fs/promises'
import { join } from 'path'

const execAsync = promisify(exec)

// POST /api/migrate/recreate - Delete old migrations and create new ones for MySQL
export async function POST() {
  try {
    console.log('Recreating migrations for MySQL...')
    
    // Step 1: Delete the migrations folder (except migration_lock.toml)
    const migrationsPath = join(process.cwd(), 'prisma', 'migrations')
    console.log('Deleting old migrations...')
    
    try {
      await rm(migrationsPath, { recursive: true, force: true })
      console.log('Old migrations deleted')
    } catch (err) {
      console.log('No existing migrations to delete or error:', err)
    }
    
    // Step 2: Push the schema to the database
    // This will create/update tables directly without using migrations
    console.log('Pushing schema to database...')
    const { stdout: pushStdout, stderr: pushStderr } = await execAsync('npx prisma db push --force-reset --accept-data-loss --skip-generate')
    console.log('Push output:', pushStdout)
    if (pushStderr) {
      console.error('Push stderr:', pushStderr)
    }

    return NextResponse.json({
      success: true,
      message: 'Database schema synchronized for MySQL. Old migrations deleted, tables created via db push.',
      output: pushStdout
    })
  } catch (error: unknown) {
    console.error('Recreate error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    const errorOutput = (error as { stdout?: string }).stdout || ''
    const errorStderr = (error as { stderr?: string }).stderr || ''
    
    return NextResponse.json(
      {
        error: 'Recreate failed',
        message: errorMessage,
        output: errorOutput,
        stderr: errorStderr
      },
      { status: 500 }
    )
  }
}

