import { act, renderHook } from '@testing-library/react';
import React from 'react';
import { CartProvider, useCart } from './CartContext';
import { DrinkWithSelections } from '../interfaces/Drink';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <CartProvider>{children}</CartProvider>
);

const drink: DrinkWithSelections = {
  id: '1',
  name: 'Mojito',
  type_of_drink: 'Cocktail',
  ingredients: [],
  quantity: 2,
};

describe('CartContext', () => {
  beforeEach(() => sessionStorage.clear());

  test('starts empty', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    expect(result.current.cart).toEqual([]);
  });

  test('setCart updates state and persists to sessionStorage', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => result.current.setCart([drink]));
    expect(result.current.cart).toHaveLength(1);
    expect(JSON.parse(sessionStorage.getItem('cart') || '[]')).toHaveLength(1);
  });

  test('clearCart empties the cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => result.current.setCart([drink]));
    act(() => result.current.clearCart());
    expect(result.current.cart).toEqual([]);
  });
});
