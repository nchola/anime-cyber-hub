/**
 * This script helps you run the SQL migration in your Supabase project.
 * 
 * To use this script:
 * 1. Make sure you have Node.js installed
 * 2. Install the required dependencies: npm install dotenv
 * 3. Create a .env file in the root directory with your Supabase credentials:
 *    SUPABASE_URL=your_supabase_url
 *    SUPABASE_SERVICE_KEY=your_supabase_service_key
 * 4. Run the script: node supabase/run-migration.js
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Check if environment variables are set
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
  console.error('Error: SUPABASE_URL and SUPABASE_SERVICE_KEY must be set in your .env file');
  process.exit(1);
}

// Create Supabase client with service role key
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

async function runMigration() {
  try {
    // Read the migration file
    const migrationPath = path.join(__dirname, 'migrations', '20240101000000_create_bookmarks_table.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    console.log('Running migration...');
    
    // Split the SQL into individual statements
    const statements = migrationSQL
      .split(';')
      .map(statement => statement.trim())
      .filter(statement => statement.length > 0);
    
    // Execute each statement separately
    for (const statement of statements) {
      console.log(`Executing: ${statement.substring(0, 50)}...`);
      
      const { error } = await supabase.rpc('exec_sql', { 
        sql: statement + ';' 
      });
      
      if (error) {
        // If the error is about the function not existing, we need to create it first
        if (error.message.includes('Could not find the function public.exec_sql')) {
          console.log('Creating exec_sql function first...');
          
          // Create the exec_sql function
          const createFunctionSQL = `
            CREATE OR REPLACE FUNCTION public.exec_sql(sql text)
            RETURNS void
            LANGUAGE plpgsql
            SECURITY DEFINER
            AS $$
            BEGIN
              EXECUTE sql;
            END;
            $$;
          `;
          
          const { error: createFunctionError } = await supabase.rpc('exec_sql', { 
            sql: createFunctionSQL 
          });
          
          if (createFunctionError) {
            console.error('Error creating exec_sql function:', createFunctionError);
            console.log('Please use the manual migration approach instead.');
            process.exit(1);
          }
          
          // Try executing the statement again
          const { error: retryError } = await supabase.rpc('exec_sql', { 
            sql: statement + ';' 
          });
          
          if (retryError) {
            console.error('Error executing SQL:', retryError);
            console.log('Please use the manual migration approach instead.');
            process.exit(1);
          }
        } else {
          console.error('Error executing SQL:', error);
          console.log('Please use the manual migration approach instead.');
          process.exit(1);
        }
      }
    }
    
    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Error running migration:', error);
    console.log('Please use the manual migration approach instead.');
    process.exit(1);
  }
}

runMigration(); 