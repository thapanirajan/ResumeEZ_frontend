export interface LoginType {
    email: string,
    password: string
}

export interface RegisterType {
    email: string,
    password: string,
    confirm_password: string,
    role: "HR" | "User"
}