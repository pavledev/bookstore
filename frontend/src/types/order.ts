import { OrderItem } from "@/types/orderItem";

export interface OrderModel
{
    orderId: number;
    totalAmount: number;
    createdAt: string;
    orderItems: OrderItem[];
}
