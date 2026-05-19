import axios from 'axios';
import { OrderData, Order, DrinkWithSelections } from '../interfaces/Drink';
import {
  mockDrinks,
  mockIngredients,
  mockMenu,
  mockOperators,
  mockWarehouse,
  mockOrders,
} from './mockData';

// --- Base URL ---
const API_URL = process.env.REACT_APP_API_URL;
// When no backend URL is configured () the service
// returns local sample data instead of calling axios.
const isRealUrl = (u?: string) => !!u && /^https?:\/\/[^/\s]+/i.test(u.trim());
export const USE_MOCK = !isRealUrl(API_URL);

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

let cachedToken: string | null = null;

// ===========================
//  TOKEN MANAGEMENT LOGIC
// ===========================
export const fetchToken = async (): Promise<string> => {
  if (USE_MOCK) return 'mock-token';
  if (cachedToken) {
    return cachedToken;
  }

  const existingToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');

  if (existingToken) {
    api.defaults.headers.common['Authorization'] = `Bearer ${existingToken}`;
    cachedToken = existingToken;
    return existingToken;
  }

  if (refreshToken) {
    try {
      const res = await api.post('/token/refresh/', { refresh: refreshToken });
      const newAccess = res.data.access;

      localStorage.setItem('accessToken', newAccess);
      api.defaults.headers.common['Authorization'] = `Bearer ${newAccess}`;
      cachedToken = newAccess;
      return newAccess;
    } catch {
      localStorage.removeItem('refreshToken');
    }
  }

  try {
    const username = process.env.REACT_APP_API_USER;
    const password = process.env.REACT_APP_API_PASS;
    if (!username || !password) {
      throw new Error(
        'Missing REACT_APP_API_USER / REACT_APP_API_PASS environment variables',
      );
    }
    const res = await api.post('/token/create/', { username, password });
    const newAccess = res.data.access || res.data.token;
    const newRefresh = res.data.refresh;

    if (!newAccess) throw new Error('No token returned from backend');

    localStorage.setItem('accessToken', newAccess);
    if (newRefresh) localStorage.setItem('refreshToken', newRefresh);

    api.defaults.headers.common['Authorization'] = `Bearer ${newAccess}`;
    cachedToken = newAccess;
    return newAccess;
  } catch (err: any) {
    console.error('Failed to fetch new token:', err.message);
    throw new Error('Token fetch failed');
  }
};

// ===========================
//  API SERVICE FUNCTIONS
// ===========================

// --- Drinks ---
export const getDrinks = async (): Promise<DrinkWithSelections[]> => {
  if (USE_MOCK) {
    return mockDrinks.map((d) => ({
      id: String(d.id),
      name: d.name,
      type_of_drink: d.type_of_drink,
      image: d.image,
      price: d.price,
      customizable: d.customizable as 0 | 1,
      ingredients: d.ingredients,
      shortDescription: d.short_description,
    }));
  }
  try {
    await fetchToken();
    const res = await api.get('/drinks/');
    return Array.isArray(res.data)
      ? res.data.map((d: any) => ({
        id: String(d.id),
        name: d.name,
        type_of_drink: d.type_of_drink,
        image: d.image,
        price: d.price,
        customizable: d.customizable,
        ingredients: Array.isArray(d.ingredients) ? d.ingredients : [],
        shortDescription: d.short_description,
      }))
      : [];
  } catch (err: any) {
    console.error('Fetch drinks failed', err.response?.data || err.message);
    return [];
  }
};

// --- Ingredients ---
export const getIngredients = async (drinkId: number) => {
  if (USE_MOCK) return mockIngredients[drinkId] || [];
  try {
    await fetchToken();
    const res = await api.get(`/drink/ingredients/drop-down/?id=${drinkId}`);
    return Array.isArray(res.data.ingredients) ? res.data.ingredients : [];
  } catch (err: any) {
    console.error(
      `Fetch ingredients failed for drink ${drinkId}`,
      err.response?.data || err.message,
    );
    return [];
  }
};

// --- Build Order ---
export const buildOrder = (
  id_table: number,
  cart: {
    id_cocktail: number;
    quantity: number;
    ingredients: { id_ingredient: number }[];
  }[],
): OrderData => {
  const drink = cart
    .filter((item) => item.quantity > 0)
    .map((item) => ({
      id_cocktail: item.id_cocktail,
      quantity: item.quantity,
      ingredients: item.ingredients || [],
    }));

  return { id_table, drink };
};

// In-memory store of orders placed during a mock session so they show up
// when the dashboard polls /orders. Reset on full page reload.
const mockPlacedOrders: Array<{
  id: number;
  id_table: number;
  status: 0 | 1 | 2;
  created_at: string;
}> = [];

// --- Send Order ---
export const sendOrder = async (orderData: OrderData) => {
  if (USE_MOCK) {
    const placed = {
      id: Date.now(),
      id_table: orderData.id_table,
      status: 0 as 0 | 1 | 2,
      created_at: new Date().toISOString(),
    };
    mockPlacedOrders.unshift(placed);
    return placed;
  }
  try {
    await fetchToken();
    const res = await api.post('/order/send/', orderData);
    return res.data;
  } catch (err: any) {
    console.error('Send order failed', err.response?.data || err.message);
    throw new Error('Failed to send order');
  }
};

// --- Backoffice Menu ---
export const getMenu = async () => {
  if (USE_MOCK) return mockMenu;
  try {
    await fetchToken();
    const res = await api.get('/backoffice/menu/');
    return res.data;
  } catch (err: any) {
    console.error('Fetch menu failed', err.response?.data || err.message);
    return [];
  }
};

// --- Operators ---
export const getOperators = async () => {
  if (USE_MOCK) return mockOperators;
  try {
    await fetchToken();
    const res = await api.get('/backoffice/operators/');
    return res.data;
  } catch (err: any) {
    console.error('Fetch operators failed', err.response?.data || err.message);
    return [];
  }
};

// --- Warehouse ---
export const getWarehouse = async () => {
  if (USE_MOCK) return mockWarehouse;
  try {
    await fetchToken();
    const res = await api.get('/backoffice/warehouse/');
    return res.data;
  } catch (err: any) {
    console.error('Fetch warehouse failed', err.response?.data || err.message);
    return [];
  }
};

// --- Orders ---
export const getOrders = async (): Promise<Order[]> => {
  if (USE_MOCK) {
    const seeded = mockOrders.map((o) => ({
      id: o.id,
      id_table: o.id_table,
      status: o.status as 0 | 1 | 2,
      created_at: o.created_at,
      total: 0,
      drinks: [],
    }));
    const placed = mockPlacedOrders.map((o) => ({
      id: o.id,
      id_table: o.id_table,
      status: o.status,
      created_at: o.created_at,
      total: 0,
      drinks: [],
    }));
    return [...placed, ...seeded];
  }
  try {
    await fetchToken();
    const res = await api.get('/backoffice/order/');

    return Array.isArray(res.data)
      ? res.data.map((o: any) => ({
        id: o.id,
        id_table: o.id_table,
        status: o.status as 0 | 1 | 2,
        created_at: o.created_at,
        total: 0,
        drinks: [],
      }))
      : [];
  } catch (err: any) {
    console.error('Fetch orders failed', err.response?.data || err.message);
    return [];
  }
};

export default api;
