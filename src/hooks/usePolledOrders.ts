import { useCallback, useEffect, useRef } from 'react';
import { getOrders } from '../Services/cocktailService';
import { useOrders } from '../contexts/OrdersContext';

export const usePolledOrders = (intervalMs = 5000) => {
  const { orders, setOrders } = useOrders();
  const ordersRef = useRef(orders);

  useEffect(() => {
    ordersRef.current = orders;
  }, [orders]);

  const fetchOrders = useCallback(async () => {
    try {
      const backendOrders = await getOrders();
      const merged = backendOrders.map((bOrder) => {
        const local = ordersRef.current.find((o) => o.id === bOrder.id);
        return { ...bOrder, drinks: local?.drinks || [] };
      });
      setOrders(merged);
    } catch (err) {
      console.error('Failed to fetch orders from backend', err);
    }
  }, [setOrders]);

  useEffect(() => {
    fetchOrders();
    const id = setInterval(fetchOrders, intervalMs);
    return () => clearInterval(id);
  }, [fetchOrders, intervalMs]);

  return { fetchOrders };
};
