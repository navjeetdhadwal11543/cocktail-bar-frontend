import React from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { Order } from '../../interfaces/Drink';

const statusMap: Record<number, string> = {
  0: 'Pending',
  1: 'Preparing',
  2: 'Prepared',
};

const statusColor = (status: number): string => {
  if (status === 1) return 'orange';
  if (status === 2) return 'green';
  return 'black';
};

const formatDate = (created_at?: string): string => {
  if (!created_at) return 'N/A';
  try {
    const utc = created_at.includes('Z')
      ? created_at
      : `${created_at.replace(' ', 'T')}Z`;
    const d = new Date(utc);
    if (Number.isNaN(d.getTime())) return 'N/A';
    return d.toLocaleString('it-IT', { hour12: false, timeZone: 'Europe/Rome' });
  } catch {
    return 'N/A';
  }
};

interface Props {
  orders: Order[];
  totalCount?: number;
}

const RecentOrdersTable: React.FC<Props> = ({ orders, totalCount }) => (
  <Box sx={{ mt: 5 }}>
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        mb: 2,
      }}
    >
      <Typography variant='h5' sx={{ fontWeight: 'bold' }}>
        Recent Orders
      </Typography>
      {typeof totalCount === 'number' && totalCount > orders.length && (
        <Typography variant='body2' color='text.secondary'>
          Showing {orders.length} of {totalCount}
        </Typography>
      )}
    </Box>
    <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
      <Table>
        <TableHead>
          <TableRow sx={{ background: '#f5f5f5' }}>
            <TableCell>Order Id</TableCell>
            <TableCell>Table</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Created At</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} align='center'>
                No orders yet.
              </TableCell>
            </TableRow>
          ) : (
            orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.id ?? 'N/A'}</TableCell>
                <TableCell>{order.id_table ?? 'N/A'}</TableCell>
                <TableCell sx={{ color: statusColor(order.status) }}>
                  {statusMap[order.status ?? 0]}
                </TableCell>
                <TableCell>{formatDate(order.created_at)}</TableCell>
                <TableCell>
                  {order.drinks && order.drinks.length > 0
                    ? order.drinks
                      .map((d) => `${d.name} x${d.quantity ?? 1}`)
                      .join(', ')
                    : 'N/A'}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  </Box>
);

export default RecentOrdersTable;
