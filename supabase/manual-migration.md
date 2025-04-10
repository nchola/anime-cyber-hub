# Manual Migration Guide

If you're having trouble with the automated migration script, you can manually apply the migration using the Supabase dashboard:

## Step 1: Access the Supabase Dashboard

1. Log in to your Supabase account at [https://app.supabase.com](https://app.supabase.com)
2. Select your project

## Step 2: Open the SQL Editor

1. In the left sidebar, click on "SQL Editor"
2. Click "New Query"

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

## Troubleshooting

If you encounter any errors:

1. **Table already exists**: If you see an error about the table already existing, you can modify the SQL to use `DROP TABLE IF EXISTS public.bookmarks;` at the beginning to drop the existing table first.

2. **Permission errors**: Make sure you're using the service role key (not the anon key) when connecting to the database.

3. **Syntax errors**: Check for any syntax errors in the SQL code. The SQL Editor will highlight these for you. 