import { OrderItemRequest } from "@/types/orderItemRequest";

export interface OrderRequest
{
    totalAmount: number;
    orderItems: OrderItemRequest[];
}
