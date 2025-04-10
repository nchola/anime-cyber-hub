# Supabase Setup Instructions

## Bookmarks Table Setup

To set up the bookmarks table in your Supabase project, follow these steps:

1. **Access the Supabase Dashboard**:
   - Log in to your Supabase account
   - Navigate to your project

2. **Open the SQL Editor**:
   - In the left sidebar, click on "SQL Editor"
   - Click "New Query"

3. **Run the Migration**:
   - Copy the contents of the `supabase/migrations/20240101000000_create_bookmarks_table.sql` file
   - Paste it into the SQL Editor
   - Click "Run" to execute the SQL

4. **Verify the Setup**:
   - Go to "Table Editor" in the left sidebar
   - You should see the `bookmarks` table listed
   - Check that the RLS policies are correctly applied by going to "Authentication" > "Policies"

## Table Structure

The bookmarks table has the following structure:

- `id`: Auto-incrementing primary key
- `user_id`: UUID reference to the auth.users table
- `item_id`: Integer ID of the bookmarked item (anime or manga)
- `item_type`: Text field with values 'anime' or 'manga'
- `item_data`: JSONB field containing the full item data
- `created_at`: Timestamp of when the bookmark was created
- `updated_at`: Timestamp of when the bookmark was last updated

## Row Level Security (RLS)

The table has RLS enabled with the following policies:

1. Users can only view their own bookmarks
2. Users can only insert bookmarks with their own user_id
3. Users can only update their own bookmarks
4. Users can only delete their own bookmarks

## Indexes

The table has indexes on:
- `user_id` for faster lookups by user
- `item_id` for faster lookups by item

## Automatic Timestamp Updates

A trigger automatically updates the `updated_at` column whenever a row is updated.

## Troubleshooting

If you encounter any issues with the bookmarks functionality:

1. Check that the bookmarks table was created correctly
2. Verify that RLS policies are in place
3. Ensure that the user is properly authenticated
4. Check the browser console for any errors
5. Verify that the Supabase client is properly initialized with the correct URL and anon key 