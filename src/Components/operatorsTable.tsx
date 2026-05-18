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

interface Operator {
  id: number;
  first_name: string;
  last_name: string;
  role: string;
  last_login: string | null;
  date_joined: string;
}

interface OperatorsTableProps {
  operators: Operator[];
}

type Order = 'asc' | 'desc';

const OperatorsTable: React.FC<OperatorsTableProps> = ({ operators }) => {
  const [orderBy, setOrderBy] = useState<keyof Operator>('id');
  const [order, setOrder] = useState<Order>('asc');

  const handleSort = (property: keyof Operator) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortedOperators = [...operators].sort((a, b) => {
    const aValue = a[orderBy] ?? '';
    const bValue = b[orderBy] ?? '';
    if (aValue < bValue) return order === 'asc' ? -1 : 1;
    if (aValue > bValue) return order === 'asc' ? 1 : -1;
    return 0;
  });

  const headerLabels: Record<string, string> = {
    id: 'ID',
    name: 'Name',
    role: 'Role',
    last_login: 'Last Login',
    date_joined: 'Date Joined',
  };

  const roleColors: Record<string, string> = {
    Operator: '#FF7E5F',
    Waiter: '#36A2EB',
    Barman: '#FFCE56',
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant='h6' sx={{ mb: 2, fontWeight: 'bold' }}>
        Operators
      </Typography>

      <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 3 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              {['id', 'name', 'role', 'last_login', 'date_joined'].map((head) => (
                <TableCell key={head}>
                  <TableSortLabel
                    active={
                      orderBy === head ||
                      (head === 'name' && orderBy === 'first_name')
                    }
                    direction={orderBy === head ? order : 'asc'}
                    onClick={() =>
                      head === 'name'
                        ? handleSort('first_name')
                        : handleSort(head as keyof Operator)
                    }
                  >
                    {headerLabels[head]}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {sortedOperators.map((op, index) => (
              <TableRow
                key={op.id}
                sx={{
                  backgroundColor: index % 2 === 0 ? '#fff' : '#fffaf5',
                  '&:hover': { backgroundColor: '#ffe8d0', cursor: 'pointer' },
                }}
              >
                <TableCell>{op.id}</TableCell>
                <TableCell>
                  {op.first_name} {op.last_name}
                </TableCell>
                <TableCell
                  sx={{
                    color: roleColors[op.role] || 'black',
                    fontWeight: 500,
                  }}
                >
                  {op.role}
                </TableCell>
                <TableCell>{op.last_login || '-'}</TableCell>
                <TableCell>
                  {new Date(op.date_joined).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default OperatorsTable;
