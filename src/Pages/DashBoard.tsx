import React, { useState } from 'react';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import Navbar from '../Components/Navbar';
import DashboardSidebar, {
  DashboardTab,
} from '../Components/dashboard/DashboardSidebar';
import DashboardOverview from '../Components/dashboard/DashboardOverview';
import OperatorsTable from '../Components/operatorsTable';
import MenuTable from '../Components/MenuTable';
import WarehouseTable from '../Components/Warehouse';
import { useDashboardData } from '../hooks/useDashboardData';
import { usePolledOrders } from '../hooks/usePolledOrders';
import { useOrders } from '../contexts/OrdersContext';
import { Operator } from '../interfaces/Drink';

const DashboardPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [activeTab, setActiveTab] = useState<DashboardTab>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  const { operators, menu, warehouse, refresh } = useDashboardData();
  const { fetchOrders } = usePolledOrders(5000);
  const { orders } = useOrders();

  const byRole = (role: Operator['role']) =>
    operators.filter((op) => op.role === role);

  const handleTabChange = (tab: DashboardTab) => {
    setActiveTab(tab);
    if (isMobile) setSidebarOpen(false);
  };

  return (
    <>
      <Navbar
        showSignout
        showMenu
        onToggleSidebar={() => setSidebarOpen((p) => !p)}
      />
      <Box
        sx={{
          display: 'flex',
          height: '100vh',
          bgcolor: 'background.default',
          overflow: 'hidden',
          pt: '64px',
        }}
      >
        <DashboardSidebar
          activeTab={activeTab}
          onTabChange={handleTabChange}
          open={sidebarOpen}
          onToggle={() => setSidebarOpen((p) => !p)}
          onRefresh={() => {
            refresh();
            fetchOrders();
          }}
          isMobile={isMobile}
        />

        <Box
          sx={{
            flexGrow: 1,
            ml: { xs: 0, md: '240px' },
            p: { xs: 1.5, sm: 2, md: 4 },
            overflowY: 'auto',
            width: '100%',
            minWidth: 0,
          }}
        >
          {activeTab === 'dashboard' && (
            <DashboardOverview
              operators={operators}
              menu={menu}
              warehouseCount={warehouse.length}
              orders={orders}
            />
          )}
          {activeTab === 'operators' && (
            <OperatorsTable operators={byRole('Operator')} />
          )}
          {activeTab === 'barmen' && (
            <OperatorsTable operators={byRole('Barman')} />
          )}
          {activeTab === 'waiter' && (
            <OperatorsTable operators={byRole('Waiter')} />
          )}
          {activeTab === 'menu' && <MenuTable menu={menu} />}
          {activeTab === 'warehouse' && <WarehouseTable items={warehouse} />}
        </Box>
      </Box>
    </>
  );
};

export default DashboardPage;
