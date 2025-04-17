
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { DashboardLayout } from '@/components/DashboardLayout';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';

const DatabaseTables = () => {
  const [tables, setTables] = useState<string[]>([]);

  useEffect(() => {
    const fetchTables = async () => {
      const { data, error } = await supabase.rpc('list_tables');
      
      if (error) {
        console.error('Error fetching tables:', error);
        return;
      }

      setTables(data || []);
    };

    fetchTables();
  }, []);

  return (
    <DashboardLayout>
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Database Tables</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Table Name</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tables.length === 0 ? (
              <TableRow>
                <TableCell className="text-center py-4 text-muted-foreground">No tables found in database</TableCell>
              </TableRow>
            ) : (
              tables.map((tableName, index) => (
                <TableRow key={index}>
                  <TableCell>{tableName}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </DashboardLayout>
  );
};

export default DatabaseTables;
