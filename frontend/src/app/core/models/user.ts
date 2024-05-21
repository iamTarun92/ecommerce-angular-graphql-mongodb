export interface User {
    username: string;
    email: string;
}

export interface SignInResponse {
    user: User;
    token: string;
}

export interface AddressRoot {
    _id: string;
    email: String;
    phone: String;
    address: String;
    city: String;
    state: String;
    zip: String;
    primary: Boolean;
    type: String;
    fullName: String;
}