import React, { useMemo } from 'react';
import { Box, Grid, Typography, useMediaQuery, useTheme } from '@mui/material';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import DashboardCard from '../DashboardCard';
import RecentOrdersTable from './RecentOrdersTable';
import { MenuItem, Operator, Order } from '../../interfaces/Drink';
import { gradients } from '../../theme';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
);

interface Props {
  operators: Operator[];
  menu: MenuItem[];
  warehouseCount: number;
  orders: Order[];
}

const STATUS_MAP: Record<number, string> = {
  0: 'Pending',
  1: 'Preparing',
  2: 'Prepared',
};

const MAX_POPULAR_DRINKS = 8;
const MAX_RECENT_ORDERS = 15;

const DashboardOverview: React.FC<Props> = ({
  operators,
  menu,
  warehouseCount,
  orders,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const operatorsByRole = (role: Operator['role']) =>
    operators.filter((op) => op.role === role).length;

  const popularDrinks = useMemo(() => {
    const map: Record<string, number> = {};
    orders.forEach((order) =>
      order.drinks?.forEach((d) => {
        const name = (d.name || '').trim();
        if (!name) return;
        map[name] = (map[name] || 0) + (d.quantity ?? 1);
      }),
    );
    return Object.entries(map)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, MAX_POPULAR_DRINKS);
  }, [orders]);

  const recentOrders = useMemo(
    () => orders.slice(0, MAX_RECENT_ORDERS),
    [orders],
  );

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {
      Pending: 0,
      Preparing: 0,
      Prepared: 0,
    };
    orders.forEach((order) => {
      const key = STATUS_MAP[order.status ?? 0];
      counts[key] = (counts[key] || 0) + 1;
    });
    return counts;
  }, [orders]);

  const barData = {
    labels: popularDrinks.map((d) => d.name),
    datasets: [
      {
        label: 'Orders',
        data: popularDrinks.map((d) => d.count),
        backgroundColor: 'rgba(255, 126, 95, 0.7)',
        borderColor: 'rgba(255, 126, 95, 1)',
        borderWidth: 1,
      },
    ],
  };

  const pieData = {
    labels: Object.keys(statusCounts),
    datasets: [
      {
        data: Object.values(statusCounts),
        backgroundColor: ['#FF6384', '#FFCE56', '#36A2EB'],
      },
    ],
  };

  const cards = [
    { title: 'Operator', value: operatorsByRole('Operator') },
    { title: 'Waiter', value: operatorsByRole('Waiter') },
    { title: 'Barman', value: operatorsByRole('Barman') },
    { title: 'Menu Items', value: menu.length },
    { title: 'Warehouse Items', value: warehouseCount },
  ];

  return (
    <>
      <Grid container spacing={{ xs: 1.5, sm: 2, md: 3 }} sx={{ mb: { xs: 2, md: 4 } }}>
        {cards.map((card, i) => (
          <Grid item xs={6} sm={6} md={3} key={card.title}>
            <DashboardCard
              title={card.title}
              value={card.value}
              bg={gradients.cards[i % gradients.cards.length]}
            />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={{ xs: 2, md: 4 }} sx={{ mb: { xs: 2, md: 4 } }}>
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              bgcolor: '#fff3e0',
              p: { xs: 1.5, md: 3 },
              borderRadius: 3,
              boxShadow: 3,
              height: { xs: 260, md: 350 },
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Typography
              variant={isMobile ? 'h6' : 'h5'}
              sx={{ mb: { xs: 1, md: 2 }, fontWeight: 'bold' }}
            >
              Popular Drinks
            </Typography>
            <Box sx={{ flexGrow: 1, minHeight: 0 }}>
              <Bar
                data={barData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { position: 'top', display: !isMobile },
                    title: {
                      display: popularDrinks.length === 0,
                      text: 'No orders yet',
                    },
                  },
                  scales: {
                    x: {
                      ticks: {
                        autoSkip: false,
                        maxRotation: 45,
                        minRotation: isMobile ? 45 : 0,
                        font: { size: isMobile ? 9 : 12 },
                      },
                    },
                    y: { beginAtZero: true, ticks: { precision: 0 } },
                  },
                }}
              />
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              bgcolor: '#fff3e0',
              p: { xs: 1.5, md: 3 },
              borderRadius: 3,
              boxShadow: 3,
              height: { xs: 260, md: 350 },
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Typography
              variant={isMobile ? 'h6' : 'h5'}
              sx={{ mb: { xs: 1, md: 2 }, fontWeight: 'bold' }}
            >
              Orders Status
            </Typography>
            <Box sx={{ flexGrow: 1, minHeight: 0 }}>
              <Pie
                data={pieData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: isMobile ? 'bottom' : 'right',
                      labels: {
                        boxWidth: isMobile ? 12 : 20,
                        padding: isMobile ? 8 : 15,
                        font: { size: isMobile ? 11 : 12 },
                      },
                    },
                  },
                }}
              />
            </Box>
          </Box>
        </Grid>
      </Grid>

      <RecentOrdersTable
        orders={recentOrders}
        totalCount={orders.length}
      />
    </>
  );
};

export default DashboardOverview;
