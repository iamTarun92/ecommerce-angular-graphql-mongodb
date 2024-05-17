export interface User {
    username: string;
    email: string;
}

export interface SignInResponse {
    user: User;
    token: string;
}