//lay nhung cai can cua user
export interface User{
    id: number;
    phone: string;
    fullname: string;
    email: string;
    password: string;
    
    role: "MANAGER" | "CSTASFF" | "SSTAFF" | "CUSTOMER";
}

