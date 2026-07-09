export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
    role: 'kasir' | 'pelanggan';
    phone?: string;
    address?: string;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };
};
