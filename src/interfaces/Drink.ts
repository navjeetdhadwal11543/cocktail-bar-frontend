// --- Drink & Selection Interfaces ---
export interface Ingredient {
  id: number;
  name: string;
}

export interface BackendDropdown {
  ingredients: { [category: string]: Ingredient[] }[];
}

export interface DrinkCustomExtended {
  [key: string]: string[] | string | undefined;
}

export interface Selection {
  custom: Record<string, string[] | string>;
  quantity: number;
}

export interface Drink {
  id: string;
  name: string;
  image?: string;
  type_of_drink: string;
  quantity?: number;
  price?: number;
  ingredients: BackendDropdown | Ingredient[];
  custom?: DrinkCustomExtended;
  customizable?: 0 | 1;
  shortDescription?: string;
}

export interface DrinkWithSelections extends Drink {
  customSelections?: Selection[];
  status?: 0 | 1 | 2;
}

// --- Order Interfaces ---
export interface DrinkOrder {
  id_cocktail: number;
  quantity: number;
  ingredients: { id_ingredient: number }[];
}

export interface OrderData {
  id_table: number;
  drink: DrinkOrder[];
}

export interface Order {
  id: number;
  drinks: DrinkWithSelections[];
  status: 0 | 1 | 2;
  total: number;
  id_table: number;
  created_at: string;
}

// --- Types for Backoffice Endpoints ---
export interface Operator {
  id: number;
  id_user: number;
  last_login: string | null;
  first_name: string;
  last_name: string;
  role: 'Operator' | 'Waiter' | 'Barman';
  date_joined: string;
}

export interface MenuItem {
  id: number;
  name: string;
  type_of_drink: string;
  alcoholic_base: string;
  customizable: 0 | 1;
  is_available: 1 | 0;
}

export interface WarehouseItem {
  name: string;
  type: string;
  quantity: number;
}

export interface DashboardCardProps {
  title: string;
  value: number;
  bg?: string;
}

// DrinkCard props (kept — component receives a specific drink)
export interface DrinkCardProps {
  drink: DrinkWithSelections;
  showQuantityControls?: boolean;
  onQuantityChange?: (
    id: string,
    custom: Record<string, string[] | string>,
    quantity: number,
  ) => void;
  open: boolean;
  onClose: () => void;
}
