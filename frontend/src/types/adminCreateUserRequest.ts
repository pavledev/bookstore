export interface AdminCreateUserRequest
{
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    password: string;
    confirmPassword: string;
    phoneNumber: string;
    city: string;
    streetName: string;
    streetNumber: string;
    isAdmin: boolean;
}
