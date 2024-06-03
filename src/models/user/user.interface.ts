export interface User {
    
    id: number;
    email: string;
    password: string;
    profile_img?: string;
    wins?: number;
    total_games?: number;

}