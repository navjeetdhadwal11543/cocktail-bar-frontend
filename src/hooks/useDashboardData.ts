import { useCallback, useEffect, useState } from 'react';
import {
  getMenu,
  getOperators,
  getWarehouse,
} from '../Services/cocktailService';
import { MenuItem, Operator, WarehouseItem } from '../interfaces/Drink';

interface DashboardData {
  operators: Operator[];
  menu: MenuItem[];
  warehouse: WarehouseItem[];
  loading: boolean;
  refresh: () => Promise<void>;
}

export const useDashboardData = (): DashboardData => {
  const [operators, setOperators] = useState<Operator[]>([]);
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [warehouse, setWarehouse] = useState<WarehouseItem[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const [ops, drinks, stock] = await Promise.all([
        getOperators(),
        getMenu(),
        getWarehouse(),
      ]);
      setOperators(
        ops.map((op: Operator) => ({
          ...op,
          role: op.role as 'Operator' | 'Waiter' | 'Barman',
        })),
      );
      setMenu(
        drinks.map((item: MenuItem) => ({
          ...item,
          customizable: item.customizable === 1 ? 1 : 0,
        })),
      );
      setWarehouse(stock);
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { operators, menu, warehouse, loading, refresh };
};
