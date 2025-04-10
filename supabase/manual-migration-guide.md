# Detailed Manual Migration Guide

This guide provides step-by-step instructions with detailed explanations for manually applying the bookmarks table migration in your Supabase project.

## Prerequisites

- A Supabase account
- Access to your project's dashboard
- Basic understanding of SQL

## Step 1: Access the Supabase Dashboard

1. Log in to your Supabase account at [https://app.supabase.com](https://app.supabase.com)
2. Select your project from the dashboard

## Step 2: Open the SQL Editor

1. In the left sidebar, click on "SQL Editor"
2. Click "New Query" to create a new SQL query

## Step 3: Copy and Paste the Migration SQL

Copy the following SQL code and paste it into the SQL Editor:

```sql
-- Create bookmarks table
CREATE TABLE IF NOT EXISTS public.bookmarks (
  id bigint primary key generated always as identity,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  item_id INTEGER NOT NULL,
  item_type TEXT NOT NULL CHECK (item_type IN ('anime', 'manga')),
  item_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, item_id, item_type)
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS bookmarks_user_id_idx ON public.bookmarks(user_id);
CREATE INDEX IF NOT EXISTS bookmarks_item_id_idx ON public.bookmarks(item_id);

-- Set up RLS (Row Level Security)
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to see only their own bookmarks
CREATE POLICY "Users can view their own bookmarks" 
  ON public.bookmarks 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Create policy to allow users to insert their own bookmarks
CREATE POLICY "Users can insert their own bookmarks" 
  ON public.bookmarks 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to update their own bookmarks
CREATE POLICY "Users can update their own bookmarks" 
  ON public.bookmarks 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create policy to allow users to delete their own bookmarks
CREATE POLICY "Users can delete their own bookmarks" 
  ON public.bookmarks 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update the updated_at column
CREATE TRIGGER update_bookmarks_updated_at
BEFORE UPDATE ON public.bookmarks
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
```

## Step 4: Run the SQL

1. Click the "Run" button to execute the SQL
2. You should see a success message if everything worked correctly

## Step 5: Verify the Setup

1. Go to "Table Editor" in the left sidebar
2. You should see the `bookmarks` table listed
3. Check that the RLS policies are correctly applied by going to "Authentication" > "Policies"

## Understanding the Migration

Let's break down what this migration does:

### Table Structure

The `bookmarks` table has the following columns:

- `id`: An auto-incrementing primary key
- `user_id`: References the user who created the bookmark
- `item_id`: The ID of the bookmarked item (anime or manga)
- `item_type`: Either 'anime' or 'manga'
- `item_data`: A JSON field containing the full item data
- `created_at`: When the bookmark was created
- `updated_at`: When the bookmark was last updated

### Indexes

We create two indexes to improve query performance:
- `bookmarks_user_id_idx`: For faster lookups by user
- `bookmarks_item_id_idx`: For faster lookups by item

### Row Level Security (RLS)

RLS ensures that users can only access their own data. We create four policies:
1. SELECT: Users can only view their own bookmarks
2. INSERT: Users can only insert bookmarks with their own user_id
3. UPDATE: Users can only update their own bookmarks
4. DELETE: Users can only delete their own bookmarks

### Automatic Timestamp Updates

The trigger `update_bookmarks_updated_at` automatically updates the `updated_at` column whenever a row is updated.

## Troubleshooting

If you encounter any errors:

1. **Table already exists**: If you see an error about the table already existing, you can modify the SQL to use `DROP TABLE IF EXISTS public.bookmarks;` at the beginning to drop the existing table first.

2. **Permission errors**: Make sure you're using the service role key (not the anon key) when connecting to the database.

3. **Syntax errors**: Check for any syntax errors in the SQL code. The SQL Editor will highlight these for you.

4. **Function already exists**: If you see an error about the function already existing, you can modify the SQL to use `DROP FUNCTION IF EXISTS update_updated_at_column();` at the beginning.

## Next Steps

After successfully creating the bookmarks table:

1. Update your application code to use the new table
2. Test the bookmark functionality to ensure it works correctly
3. Consider adding error handling for cases where the Supabase connection fails 