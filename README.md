# Verterans de la Devesa - v3

This version separates the public website from the admin tools.

## Files
- `index.html` public club page
- `admin.html` admin login + add/delete tools
- `app.js` shared logic for both pages
- `styles.css` shared styles
- `schema.sql` Supabase schema and policies
- `config.js.template` copy to `config.js`

## New features
- separate admin page
- delete buttons for players, practice matches, and club matches
- more graphic public home page

## Setup
1. Copy `config.js.template` to `config.js`
2. Put your Supabase URL and anon key in `config.js`
3. Run `schema.sql` in Supabase SQL editor
4. Upload files to GitHub Pages
5. Use `admin.html` for data management

## Important
If you already created tables earlier, run the new `schema.sql` again so the missing columns and policies are aligned.
