import { useEffect, useState } from 'react';
import { DrinkWithSelections } from '../interfaces/Drink';
import { getDrinks, getIngredients } from '../Services/cocktailService';

interface UseDrinksResult {
  drinks: DrinkWithSelections[];
  loading: boolean;
  error: string | null;
}

const normalize = (list: DrinkWithSelections[]): DrinkWithSelections[] =>
  list.map((d) => ({
    ...d,
    id: String(d.id),
    quantity: 0,
    ingredients: Array.isArray(d.ingredients) ? d.ingredients : [],
  }));

export const useDrinks = (
  initial?: DrinkWithSelections[],
): UseDrinksResult => {
  const [drinks, setDrinks] = useState<DrinkWithSelections[]>([]);
  const [loading, setLoading] = useState(!initial);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setError(null);
        const base = initial ? normalize(initial) : normalize(await getDrinks());

        const withIngredients = await Promise.all(
          base.map(async (d) => {
            if (!d.customizable) return d;
            const res = await getIngredients(Number(d.id));
            return { ...d, ingredients: res || [] };
          }),
        );

        if (!cancelled) setDrinks(withIngredients);
      } catch (err) {
        if (!cancelled) setError('Failed to load drinks');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [initial]);

  return { drinks, loading, error };
};
