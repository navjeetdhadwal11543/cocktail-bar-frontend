// WarehouseTable.tsx
import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  TableSortLabel,
} from '@mui/material';
import { WarehouseItem } from '../interfaces/Drink';

interface WarehouseTableProps {
  items: WarehouseItem[];
}

type Order = 'asc' | 'desc';

const WarehouseTable: React.FC<WarehouseTableProps> = ({ items }) => {
  const [orderBy, setOrderBy] = useState<keyof WarehouseItem>('name');
  const [order, setOrder] = useState<Order>('asc');

  const handleSort = (property: keyof WarehouseItem) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortedItems = [...items].sort((a, b) => {
    const aValue = a[orderBy] ?? '';
    const bValue = b[orderBy] ?? '';
    if (aValue < bValue) return order === 'asc' ? -1 : 1;
    if (aValue > bValue) return order === 'asc' ? 1 : -1;
    return 0;
  });

  const headerLabels: Record<string, string> = {
    name: 'Item Name',
    type: 'Type',
    quantity: 'Quantity',
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant='h6' sx={{ mb: 2, fontWeight: 'bold' }}>
        Warehouse Stock
      </Typography>

      <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 3 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              {['name', 'type', 'quantity'].map((head) => (
                <TableCell key={head}>
                  <TableSortLabel
                    active={orderBy === head}
                    direction={orderBy === head ? order : 'asc'}
                    onClick={() => handleSort(head as keyof WarehouseItem)}
                  >
                    {headerLabels[head]}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {sortedItems.map((item, index) => (
              <TableRow
                key={index}
                sx={{
                  backgroundColor: index % 2 === 0 ? '#fff' : '#fffaf5',
                  '&:hover': { backgroundColor: '#ffe8d0', cursor: 'pointer' },
                }}
              >
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.type}</TableCell>
                <TableCell>{item.quantity}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default WarehouseTable;
