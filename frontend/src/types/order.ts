import { OrderItem } from "@/types/orderItem";

export interface Order
{
    orderId: number;
    totalAmount: number;
    createdAt: string;
    orderItems: OrderItem[];
}
