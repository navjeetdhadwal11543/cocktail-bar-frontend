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

interface MenuItem {
  id: number;
  name: string;
  type_of_drink: string;
  alcoholic_base: string;
  customizable: 0 | 1;
  is_available: 0 | 1;
}

interface MenuTableProps {
  menu: MenuItem[];
}

type Order = 'asc' | 'desc';

const MenuTable: React.FC<MenuTableProps> = ({ menu }) => {
  const [orderBy, setOrderBy] = useState<keyof MenuItem>('id');
  const [order, setOrder] = useState<Order>('asc');

  const handleSort = (property: keyof MenuItem) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortedMenu = [...menu].sort((a, b) => {
    const aValue = a[orderBy] ?? '';
    const bValue = b[orderBy] ?? '';
    if (aValue < bValue) return order === 'asc' ? -1 : 1;
    if (aValue > bValue) return order === 'asc' ? 1 : -1;
    return 0;
  });

  const headerLabels: Record<string, string> = {
    id: 'ID',
    name: 'Name',
    type_of_drink: 'Type',
    alcoholic_base: 'Alcohol',
    customizable: 'Customizable',
    is_available: 'Available',
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant='h6' sx={{ mb: 2, fontWeight: 'bold' }}>
        Menu Items
      </Typography>

      <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 3 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              {[
                'id',
                'name',
                'type_of_drink',
                'alcoholic_base',
                'customizable',
                'is_available',
              ].map((head) => (
                <TableCell key={head}>
                  <TableSortLabel
                    active={orderBy === head}
                    direction={orderBy === head ? order : 'asc'}
                    onClick={() => handleSort(head as keyof MenuItem)}
                  >
                    {headerLabels[head]}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {sortedMenu.map((item, index) => (
              <TableRow
                key={item.id}
                sx={{
                  backgroundColor: index % 2 === 0 ? '#fff' : '#fffaf5',
                  '&:hover': { backgroundColor: '#fff1d6', cursor: 'pointer' },
                }}
              >
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.type_of_drink}</TableCell>
                <TableCell>{item.alcoholic_base}</TableCell>
                <TableCell
                  sx={{
                    color: item.customizable ? '#36A2EB' : '#FF6384',
                    fontWeight: 500,
                  }}
                >
                  {item.customizable ? 'Yes' : 'No'}
                </TableCell>
                <TableCell
                  sx={{
                    color: item.is_available ? '#36A2EB' : '#FF6384',
                    fontWeight: 500,
                  }}
                >
                  {item.is_available ? 'Yes' : 'No'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default MenuTable;
