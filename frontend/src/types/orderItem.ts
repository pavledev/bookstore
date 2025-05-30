import { Book } from "@/types/book";

export interface OrderItem
{
    book: Book;
    quantity: number;
    unitPrice: number;
}
