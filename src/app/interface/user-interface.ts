export interface CurrentUser {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    verifyExpires: number;
    isVerified: boolean;
    password_expiry: string;
    user_type: number;
    id_upload: string;
    phone_number?: string;
    id_number?: number;
}