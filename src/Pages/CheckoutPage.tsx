import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Snackbar,
  Alert,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import { getDrinkImage } from '../utils/getDrinkImage';
import {
  OrderData,
  Ingredient,
  Selection,
  Order,
  DrinkWithSelections,
} from '../interfaces/Drink';
import { sendOrder } from '../Services/cocktailService';
import { useCart } from '../contexts/CartContext';
import { useOrders } from '../contexts/OrdersContext';
import { gradientButton, darkHeader, pageContainer } from '../styles/sx';

const TABLE_ID = Number(process.env.REACT_APP_TABLE_ID) || 1;

const extractIngredients = (d: DrinkWithSelections): Ingredient[] => {
  if (d.customizable && Array.isArray(d.ingredients)) {
    return d.ingredients.flatMap((catObj) =>
      typeof catObj === 'object' && catObj !== null
        ? (Object.values(catObj).flat() as Ingredient[])
        : [],
    );
  }
  if (!d.customizable) {
    if (Array.isArray(d.ingredients)) return d.ingredients as Ingredient[];
    if (
      d.ingredients &&
      typeof d.ingredients === 'object' &&
      'ingredients' in d.ingredients
    ) {
      const arr = (d.ingredients as { ingredients: Record<string, Ingredient[]>[] })
        .ingredients;
      return arr.flatMap((catObj) => Object.values(catObj).flat() as Ingredient[]);
    }
  }
  return [];
};

const buildOrderPayload = (cart: DrinkWithSelections[]): OrderData => ({
  id_table: TABLE_ID,
  drink: cart.flatMap((d) => {
    const selections: Selection[] =
      d.customSelections && d.customSelections.length > 0
        ? d.customSelections
        : [{ custom: {}, quantity: d.quantity || 0 }];
    const allIngredients = extractIngredients(d);

    return selections.map((sel) => {
      let ingredients: { id_ingredient: number }[];
      if (d.customizable) {
        ingredients = Object.values(sel.custom)
          .flatMap((val) => (Array.isArray(val) ? val : [val]))
          .map((customName) => {
            const ing = allIngredients.find((i) => i.name === customName);
            return ing ? { id_ingredient: ing.id } : null;
          })
          .filter((v): v is { id_ingredient: number } => v !== null);

        if (ingredients.length === 0) {
          ingredients = allIngredients.map((i) => ({ id_ingredient: i.id }));
        }
      } else {
        ingredients = allIngredients.map((i) => ({ id_ingredient: i.id }));
      }
      return {
        id_cocktail: Number(d.id),
        quantity: sel.quantity,
        ingredients,
      };
    });
  }),
});

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { cart, setCart, clearCart } = useCart();
  const { orders, setOrders } = useOrders();
  const [toast, setToast] = useState<
    { msg: string; severity: 'success' | 'error' } | null
  >(null);

  const handleModify = () => navigate('/menu', { state: { selected: cart } });

  const handleSendOrder = async () => {
    if (cart.length === 0) return;
    try {
      const orderData = buildOrderPayload(cart);
      const response = await sendOrder(orderData);
      setToast({ msg: 'Order sent successfully!', severity: 'success' });

      const total = cart.reduce(
        (acc, d) => acc + (d.quantity || 0) * (d.price || 0),
        0,
      );
      const newOrder: Order = {
        id: response?.id ?? Date.now(),
        drinks: cart,
        status: 0,
        total,
        id_table: TABLE_ID,
        created_at: new Date().toISOString(),
      };

      setOrders([newOrder, ...orders]);
      clearCart();
      setTimeout(() => navigate('/dashboard'), 600);
    } catch (err) {
      console.error('Order failed:', err);
      setToast({ msg: 'Failed to send order.', severity: 'error' });
    }
  };

  const handleRemove = (drinkId: string, selIndex: number) => {
    const updated = cart
      .map((d) => {
        if (d.id !== drinkId) return d;
        const newSelections = (d.customSelections || []).filter(
          (_, i) => i !== selIndex,
        );
        return {
          ...d,
          customSelections: newSelections,
          quantity: newSelections.reduce((sum, s) => sum + s.quantity, 0),
        };
      })
      .filter((d) => (d.quantity || 0) > 0);
    setCart(updated);
  };

  return (
    <Box sx={pageContainer}>
      <Box sx={darkHeader}>
        <Typography
          sx={{ fontWeight: 'bold', color: '#fff', cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          🍹 Cocktail Bar
        </Typography>
        <Button sx={gradientButton} onClick={() => navigate('/')}>
          Esci
        </Button>
      </Box>

      <Box sx={{ flex: 1, p: 3 }}>
        {cart.length === 0 ? (
          <Typography variant='h6' sx={{ textAlign: 'center' }}>
            Checkout
          </Typography>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Indice</TableCell>
                <TableCell>Immagine</TableCell>
                <TableCell>Bevanda e ingredienti</TableCell>
                <TableCell>Quantità</TableCell>
                <TableCell>Delete</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {cart.map((drink, idx) =>
                (drink.customSelections && drink.customSelections.length > 0
                  ? drink.customSelections
                  : [{ custom: {}, quantity: drink.quantity || 0 }]
                ).map((sel, i) => (
                  <TableRow
                    key={`${drink.id}-${i}`}
                    sx={{ bgcolor: i % 2 === 0 ? '#ffffff' : '#f5f5f5' }}
                  >
                    <TableCell>{idx + 1}</TableCell>
                    <TableCell>
                      <Avatar
                        src={getDrinkImage(drink.name)}
                        sx={{
                          width: 64,
                          height: 64,
                          borderRadius: '8px',
                          border: '2px solid #ff9800',
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>
                      {drink.name}
                      {Object.keys(sel.custom).length > 0 && (
                        <Box sx={{ fontWeight: 'normal', mt: 0.5 }}>
                          {Object.entries(sel.custom)
                            .map(([, val]) =>
                              Array.isArray(val) ? val.join(', ') : val,
                            )
                            .join(', ')}
                        </Box>
                      )}
                    </TableCell>
                    <TableCell>{sel.quantity}</TableCell>
                    <TableCell>
                      <IconButton
                        color='error'
                        onClick={() => handleRemove(drink.id, i)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                )),
              )}
            </TableBody>
          </Table>
        )}
      </Box>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          px: 3,
          py: 2,
        }}
      >
        <Button startIcon={<EditIcon />} onClick={handleModify} sx={gradientButton}>
          Modifica
        </Button>
        <Button
          onClick={handleSendOrder}
          disabled={cart.length === 0}
          sx={gradientButton}
        >
          Invia Ordine
        </Button>
      </Box>

      <Snackbar
        open={!!toast}
        autoHideDuration={4000}
        onClose={() => setToast(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        {toast ? (
          <Alert
            severity={toast.severity}
            variant='filled'
            onClose={() => setToast(null)}
            sx={{ width: '100%' }}
          >
            {toast.msg}
          </Alert>
        ) : undefined}
      </Snackbar>
    </Box>
  );
};

export default CheckoutPage;
