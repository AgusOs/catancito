export interface Match{
    id: number;
    creatorId: number
    players: Array<number>
    created_at?: string
    winnerId: number
}