import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Avatar,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Radio,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import CloseIcon from '@mui/icons-material/Close';
import { DrinkCardProps, Selection, Ingredient } from '../interfaces/Drink';
import { getIngredients } from '../Services/cocktailService';
import { getDrinkImage } from '../utils/getDrinkImage';
import { gradientCircleButton, gradientMainButton } from '../styles/sx';

const DrinkCard: React.FC<DrinkCardProps> = ({
  drink,
  onQuantityChange,
  open,
  onClose,
}) => {
  const [dropdown, setDropdown] = useState<Record<string, Ingredient[]>>({});
  const [custom, setCustom] = useState<Record<string, string[] | string>>({});
  const [quantity, setQuantity] = useState<number>(0);
  const [addedSelections, setAddedSelections] = useState<Selection[]>([]);
  const [sessionAdded, setSessionAdded] = useState<Selection[]>([]);

  const shortDescription =
    (drink as any).short_description || drink.shortDescription || '';

  useEffect(() => {
    let cancelled = false;

    const fetchIngredients = async () => {
      if (!drink.customizable) return;
      try {
        const data = await getIngredients(Number(drink.id));
        if (cancelled) return;

        const combined: Record<string, Ingredient[]> = {};
        data.forEach((catObj: Record<string, Ingredient[]>) => {
          Object.entries(catObj).forEach(([cat, items]) => {
            combined[cat] = items;
          });
        });
        setDropdown(combined);
      } catch {
        if (!cancelled) setDropdown({});
      }
    };

    fetchIngredients();

    setAddedSelections(drink.customSelections || []);
    setSessionAdded([]);
    setCustom({});
    setQuantity(0);

    return () => {
      cancelled = true;
    };
  }, [drink.id, drink.customizable, drink.customSelections]);

  const inc = () => setQuantity((q) => q + 1);
  const dec = () => setQuantity((q) => Math.max(0, q - 1));

  const toggleIngredient = (category: string, name: string) => {
    setCustom((prev) => ({ ...prev, [category]: [name] }));
  };

  const handleAddSelection = () => {
    if (quantity <= 0) return;

    const selection: Selection = { custom: { ...custom }, quantity };

    setAddedSelections((prev) => {
      const existingIndex = prev.findIndex(
        (s) => JSON.stringify(s.custom) === JSON.stringify(custom),
      );
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        };
        return updated;
      }
      return [...prev, selection];
    });

    setSessionAdded((prev) => {
      const existingIndex = prev.findIndex(
        (s) => JSON.stringify(s.custom) === JSON.stringify(custom),
      );
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        };
        return updated;
      }
      return [...prev, selection];
    });

    setCustom({});
    setQuantity(0);
  };

  const handleRemoveSelection = (idx: number) => {
    const sel = addedSelections[idx];
    if (!sel) return;
    setAddedSelections((prev) => prev.filter((_, i) => i !== idx));
    setSessionAdded((prev) => prev.filter((s) => s !== sel));
    onQuantityChange?.(drink.id, sel.custom, 0);
  };

  const handleSend = () => {
    sessionAdded.forEach((sel) => {
      onQuantityChange?.(drink.id, sel.custom, sel.quantity);
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth='sm'>
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar
            src={drink.image ? drink.image : getDrinkImage(drink.name)}
            sx={{ width: 64, height: 64, border: '2px solid #ff9800' }}
          />
          <Box>
            <Typography variant='h6' sx={{ fontWeight: 'bold' }}>
              {drink.name}
            </Typography>
            {shortDescription && (
              <Typography variant='body2' color='text.secondary'>
                {shortDescription}
              </Typography>
            )}
            <Typography variant='caption'>{drink.type_of_drink}</Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {drink.customizable ? (
          Object.entries(dropdown).map(([category, items]) => (
            <Accordion key={category} sx={{ mb: 1 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography sx={{ fontWeight: 'bold' }}>{category}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Ingredient</TableCell>
                      <TableCell>Select</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {items.map((it, index) => (
                      <TableRow
                        key={it.id}
                        sx={{
                          bgcolor: index % 2 === 0 ? '#ffffff' : '#f5f5f5',
                        }}
                      >
                        <TableCell sx={{ fontWeight: 'bold' }}>
                          {it.name}
                        </TableCell>
                        <TableCell>
                          <Radio
                            checked={custom[category]?.[0] === it.name}
                            onChange={() => toggleIngredient(category, it.name)}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </AccordionDetails>
            </Accordion>
          ))
        ) : (
          <Typography sx={{ mt: 1 }}>
            Questa bevanda non è personalizzabile.
          </Typography>
        )}

        {/* Quantity buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
          <IconButton
            sx={gradientCircleButton}
            onClick={dec}
            disabled={quantity === 0}
          >
            <RemoveIcon />
          </IconButton>
          <Typography variant='h6' sx={{ alignSelf: 'center' }}>
            {quantity}
          </Typography>
          <IconButton sx={gradientCircleButton} onClick={inc}>
            <AddIcon />
          </IconButton>
        </Box>

        {/* Add selection button */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Button
            sx={gradientMainButton}
            onClick={handleAddSelection}
            disabled={quantity === 0}
          >
            Aggiungere
          </Button>
        </Box>

        {/* Added selections */}
        <Box sx={{ mt: 3 }}>
          <Typography variant='subtitle2'>Aggiunto:</Typography>
          {addedSelections.length === 0 ? (
            <Typography>Nessuna selezione aggiunta ancora.</Typography>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Indice</TableCell>
                  <TableCell>Bevanda</TableCell>
                  <TableCell>Quantità</TableCell>
                  <TableCell>Ingredienti</TableCell>
                  <TableCell>Azione</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {addedSelections.map((s, i) => (
                  <TableRow
                    key={i}
                    sx={{ bgcolor: i % 2 === 0 ? '#ffffff' : '#f5f5f5' }}
                  >
                    <TableCell>{i + 1}</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>
                      {drink.name}
                    </TableCell>
                    <TableCell>{s.quantity}</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>
                      {Object.entries(s.custom).length > 0
                        ? Object.entries(s.custom)
                          .map(([cat, arr]) =>
                            Array.isArray(arr)
                              ? `${cat}: ${arr.join(', ')}`
                              : `${cat}: ${arr}`,
                          )
                          .join(', ')
                        : '-'}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        sx={gradientCircleButton}
                        onClick={() => handleRemoveSelection(i)}
                      >
                        <CloseIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button sx={gradientMainButton} onClick={handleSend}>
          Send
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DrinkCard;
