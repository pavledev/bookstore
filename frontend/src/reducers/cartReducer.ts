import { CartItemEntry } from '@/utils/cartStorage';

export type CartAction =
    | { type: 'INIT'; payload: CartItemEntry[] }
    | { type: 'ADD'; payload: number }
    | { type: 'REMOVE'; payload: number }
    | { type: 'UPDATE_QUANTITY'; payload: { bookId: number; selectedQuantity: number } }
    | { type: 'CLEAR' };

export const cartReducer = (state: CartItemEntry[], action: CartAction): CartItemEntry[] =>
{
    switch (action.type)
    {
        case 'INIT':
            return action.payload;

        case 'ADD':
        {
            const index = state.findIndex(item => item.bookId === action.payload);

            if (index !== -1)
            {
                return state.map(item =>
                    item.bookId === action.payload
                        ? { ...item, selectedQuantity: item.selectedQuantity + 1 }
                        : item
                );
            }

            return [...state, { bookId: action.payload, selectedQuantity: 1 }];
        }

        case 'REMOVE':
            return state.filter(item => item.bookId !== action.payload);

        case 'UPDATE_QUANTITY':
            return state.map(item =>
                item.bookId === action.payload.bookId
                    ? { ...item, selectedQuantity: action.payload.selectedQuantity }
                    : item
            );

        case 'CLEAR':
            return [];

        default:
            return state;
    }
};
