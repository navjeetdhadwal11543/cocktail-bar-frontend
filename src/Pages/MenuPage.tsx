import React, { useEffect, useMemo, useState } from 'react';
import { Box, Button, Skeleton } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import DrinkCard from '../Components/DrinkCard';
import DrinkTile from '../Components/DrinkTile';
import { DrinkWithSelections, Selection } from '../interfaces/Drink';
import { useCart } from '../contexts/CartContext';
import { useDrinks } from '../hooks/useDrinks';
import { gradientButton, gradientButtonLarge, darkHeader, pageContainer } from '../styles/sx';

const sameCustom = (a: Selection['custom'], b: Selection['custom']) =>
  JSON.stringify(a) === JSON.stringify(b);

const MenuPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const initialDrinks = (location.state as { drinks?: DrinkWithSelections[] } | null)
    ?.drinks;

  const { drinks, loading } = useDrinks(initialDrinks);
  const { cart, setCart } = useCart();

  const [cocktails, setCocktails] = useState<DrinkWithSelections[]>([]);
  const [menuOpen, setMenuOpen] = useState(true);
  const [openDialogDrink, setOpenDialogDrink] =
    useState<DrinkWithSelections | null>(null);

  // Merge fetched drinks with whatever the cart currently holds.
  useEffect(() => {
    const merged = drinks.map((d) => {
      const stored = cart.find((c) => c.id === d.id);
      if (!stored) return d;
      const totalQty = (stored.customSelections || []).reduce(
        (sum, s) => sum + s.quantity,
        0,
      );
      return {
        ...d,
        customSelections: stored.customSelections || [],
        quantity: totalQty,
      };
    });
    setCocktails(merged);
    // We intentionally do NOT depend on `cart` to avoid resetting selections
    // every time the cart updates from within this page.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [drinks]);

  useEffect(() => {
    if (!menuOpen) setOpenDialogDrink(null);
  }, [menuOpen]);

  const selectedDrinks = useMemo(
    () => cocktails.filter((d) => (d.quantity ?? 0) > 0),
    [cocktails],
  );

  const handleRemove = (drinkId: string) => {
    const updated = cocktails.map((d) =>
      d.id === drinkId ? { ...d, quantity: 0, customSelections: [] } : d,
    );
    setCocktails(updated);
    setCart(updated.filter((d) => (d.quantity ?? 0) > 0));
  };

  const handleQuantityChange = (
    id: string,
    custom: Selection['custom'],
    qty: number,
  ) => {
    const updated = cocktails.map((drink) => {
      if (drink.id !== id) return drink;
      const existing = drink.customSelections || [];
      let newSelections: Selection[];

      if (qty === 0) {
        newSelections = existing.filter((s) => !sameCustom(s.custom, custom));
      } else {
        const idx = existing.findIndex((s) => sameCustom(s.custom, custom));
        if (idx >= 0) {
          newSelections = existing.map((s, i) =>
            i === idx ? { ...s, quantity: s.quantity + qty } : s,
          );
        } else {
          newSelections = [...existing, { custom, quantity: qty }];
        }
      }

      const totalQty = newSelections.reduce((sum, s) => sum + s.quantity, 0);
      return { ...drink, quantity: totalQty, customSelections: newSelections };
    });

    setCocktails(updated);
    setCart(updated.filter((d) => (d.quantity ?? 0) > 0));
  };

  return (
    <Box sx={pageContainer}>
      <Box sx={darkHeader}>
        <Button onClick={() => setMenuOpen((p) => !p)} sx={gradientButton}>
          Menu
        </Button>
        <Button onClick={() => navigate('/')} sx={gradientButton}>
          Esci
        </Button>
      </Box>

      {menuOpen && (
        <Box sx={{ flex: 1, p: 3 }}>
          <Box
            sx={{
              display: 'grid',
              gap: '20px',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            }}
          >
            {loading
              ? Array.from({ length: 5 }).map((_, i) => (
                <Skeleton
                  key={i}
                  variant='rounded'
                  height={260}
                  sx={{ borderRadius: 3 }}
                />
              ))
              : cocktails.map((drink) => (
                <DrinkTile
                  key={drink.id}
                  drink={drink}
                  onOpen={() => setOpenDialogDrink(drink)}
                  onRemove={() => handleRemove(drink.id)}
                />
              ))}
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
            <Button
              variant='contained'
              disabled={selectedDrinks.length === 0}
              onClick={() =>
                navigate('/checkout', { state: { selected: selectedDrinks } })
              }
              sx={gradientButtonLarge}
            >
              Procedi al Checkout
            </Button>
          </Box>

          {openDialogDrink && (
            <DrinkCard
              drink={openDialogDrink}
              showQuantityControls
              open={Boolean(openDialogDrink)}
              onClose={() => setOpenDialogDrink(null)}
              onQuantityChange={handleQuantityChange}
            />
          )}
        </Box>
      )}
    </Box>
  );
};

export default MenuPage;
