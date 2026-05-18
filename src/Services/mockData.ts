// Sample data used when REACT_APP_API_URL is not set (e.g. Netlify demo deploy
// without an available backend). The shapes match what the real backend returns,
// so the UI behaves the same in both modes.

export const mockDrinks = [
  {
    id: 1,
    name: 'Mojito',
    type_of_drink: 'Cocktail',
    image: '/Images/mojito.jpeg',
    price: 8.5,
    customizable: 1,
    ingredients: [],
    short_description: 'Rum, mint, lime and soda — fresh and classic.',
  },
  {
    id: 2,
    name: 'Gin Tonic',
    type_of_drink: 'Cocktail',
    image: '/Images/ginTonic.jpeg',
    price: 9,
    customizable: 1,
    ingredients: [],
    short_description: 'Gin with tonic water and a slice of lime.',
  },
  {
    id: 3,
    name: 'Gin Lemon',
    type_of_drink: 'Cocktail',
    image: '/Images/ginLemon.jpeg',
    price: 9,
    customizable: 1,
    ingredients: [],
    short_description: 'Gin with lemon soda — crisp and citrusy.',
  },
  {
    id: 4,
    name: 'Moscow Mule',
    type_of_drink: 'Cocktail',
    image: '/Images/moscowmule.jpeg',
    price: 9.5,
    customizable: 1,
    ingredients: [],
    short_description: 'Vodka, ginger beer and lime in a copper mug.',
  },
  {
    id: 5,
    name: 'Alexander',
    type_of_drink: 'Cocktail',
    image: '/Images/alexander.jpeg',
    price: 10,
    customizable: 0,
    ingredients: [],
    short_description: 'Cognac, cocoa liqueur and cream — sweet and rich.',
  },
];

export const mockIngredients: Record<number, any[]> = {
  1: [{ Mint: [{ id: 1, name: 'Extra mint' }, { id: 2, name: 'No mint' }] }],
  2: [{ Garnish: [{ id: 3, name: 'Lime' }, { id: 4, name: 'Cucumber' }] }],
  3: [{ Garnish: [{ id: 5, name: 'Lemon peel' }] }],
  4: [{ Garnish: [{ id: 6, name: 'Lime wedge' }] }],
};

const alcoholicBaseByDrink: Record<string, string> = {
  Mojito: 'Rum',
  'Gin Tonic': 'Gin',
  'Gin Lemon': 'Gin',
  'Moscow Mule': 'Vodka',
  Alexander: 'Cognac',
};

export const mockMenu = mockDrinks.map((d) => ({
  id: d.id,
  name: d.name,
  type_of_drink: d.type_of_drink,
  alcoholic_base: alcoholicBaseByDrink[d.name] || 'Other',
  customizable: d.customizable as 0 | 1,
  is_available: 1 as 0 | 1,
}));

export const mockOperators = [
  {
    id: 1,
    id_user: 101,
    last_login: '2026-05-10T18:22:00Z',
    first_name: 'Luca',
    last_name: 'Rossi',
    role: 'Barman',
    date_joined: '2025-01-15T09:00:00Z',
  },
  {
    id: 2,
    id_user: 102,
    last_login: '2026-05-12T20:10:00Z',
    first_name: 'Maria',
    last_name: 'Bianchi',
    role: 'Waiter',
    date_joined: '2025-03-02T09:00:00Z',
  },
  {
    id: 3,
    id_user: 103,
    last_login: null,
    first_name: 'Giulia',
    last_name: 'Verdi',
    role: 'Operator',
    date_joined: '2025-06-20T09:00:00Z',
  },
];

export const mockWarehouse = [
  { name: 'White Rum', type: 'Spirit', quantity: 12 },
  { name: 'Gin', type: 'Spirit', quantity: 8 },
  { name: 'Vodka', type: 'Spirit', quantity: 10 },
  { name: 'Tonic Water', type: 'Mixer', quantity: 40 },
  { name: 'Ginger Beer', type: 'Mixer', quantity: 25 },
  { name: 'Mint', type: 'Garnish', quantity: 30 },
  { name: 'Lime', type: 'Garnish', quantity: 50 },
];

export const mockOrders: Array<{
  id: number;
  id_table: number;
  status: 0 | 1 | 2;
  created_at: string;
}> = [];
