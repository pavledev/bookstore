import { CreateOrderItemRequest } from "@/types/createOrderItemRequest";

export interface CreateOrderRequest
{
    totalAmount: number;
    orderItems: CreateOrderItemRequest[];
}
