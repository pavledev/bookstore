import { Role } from "@/types/role";

export interface User
{
    userId: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    city: string;
    streetName: string;
    streetNumber: string;
    roles: Role[];
}
