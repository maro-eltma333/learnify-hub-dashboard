
-- Create a function to list tables in the database
CREATE OR REPLACE FUNCTION public.list_tables()
RETURNS TEXT[]
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  table_names TEXT[];
BEGIN
  SELECT array_agg(table_name ORDER BY table_name)
  INTO table_names
  FROM information_schema.tables
  WHERE table_schema = 'public';
  
  RETURN table_names;
END;
$$;
