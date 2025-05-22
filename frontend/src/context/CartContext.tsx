'use client';

import React, { createContext, useContext, useEffect, useReducer } from 'react';
import { cartReducer, CartAction } from '@/reducers/cartReducer';
import { getCart, saveCart, CartItemEntry } from '@/utils/cartStorage';

interface CartContextValue
{
    cart: CartItemEntry[];
    dispatch: React.Dispatch<CartAction>;
    totalItems: number;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) =>
{
    const [cart, dispatch] = useReducer(cartReducer, []);

    useEffect(() =>
    {
        const stored = getCart();

        dispatch({ type: 'INIT', payload: stored });
    }, []);

    useEffect(() =>
    {
        saveCart(cart);
    }, [cart]);

    const totalItems = cart.reduce((sum, item) => sum + item.selectedQuantity, 0);

    return (
        <CartContext.Provider value={{ cart, dispatch, totalItems }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () =>
{
    const context = useContext(CartContext)

    if (!context)
    {
        throw new Error('useCart must be used within a CartProvider');
    }

    return context;
};
