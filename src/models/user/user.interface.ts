export interface User {
    
    id: number;
    email: string;
    user_name: string | null;
    password: string;
    profile_img: string | null;
    wins: number | null;
    total_games: number | null;

}