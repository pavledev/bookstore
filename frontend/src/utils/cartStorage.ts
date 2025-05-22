export interface CartItemEntry
{
    bookId: number;
    selectedQuantity: number;
}

const STORAGE_KEY = 'cart';

export const getCart = (): CartItemEntry[] =>
{
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
};

export const saveCart = (cart: CartItemEntry[]): void =>
{
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
};
