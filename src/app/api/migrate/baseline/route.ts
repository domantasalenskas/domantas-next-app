import { NextResponse } from 'next/server'
import { exec } from 'child_process'
import { promisify } from 'util'
import { readdir } from 'fs/promises'
import { join } from 'path'

const execAsync = promisify(exec)

// POST /api/migrate/baseline - Mark all existing migrations as applied
export async function POST() {
  try {
    console.log('Starting database baseline...')
    
    // Get list of migrations from the migrations folder
    const migrationsPath = join(process.cwd(), 'prisma', 'migrations')
    const migrationFolders = await readdir(migrationsPath)
    
    // Filter out non-migration folders (like migration_lock.toml)
    const migrations = migrationFolders.filter(folder => 
      folder.match(/^\d{14}_/) // Matches migration folder pattern like 20251001122817_init
    )
    
    console.log(`Found ${migrations.length} migration(s):`, migrations)
    
    if (migrations.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'No migrations found to baseline'
      }, { status: 400 })
    }
    
    // Mark each migration as applied
    const results = []
    for (const migration of migrations) {
      console.log(`Marking migration as applied: ${migration}`)
      const { stdout, stderr } = await execAsync(
        `npx prisma migrate resolve --applied "${migration}"`
      )
      
      results.push({
        migration,
        stdout,
        stderr
      })
      
      console.log(`Migration ${migration} marked as applied`)
    }
    
    return NextResponse.json({
      success: true,
      message: 'All migrations marked as applied (baselined)',
      migrations: results
    })
  } catch (error: unknown) {
    console.error('Baseline error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    const errorOutput = (error as { stdout?: string }).stdout || ''
    const errorStderr = (error as { stderr?: string }).stderr || ''
    
    return NextResponse.json(
      {
        error: 'Baseline failed',
        message: errorMessage,
        output: errorOutput,
        stderr: errorStderr
      },
      { status: 500 }
    )
  }
}

