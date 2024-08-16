export interface CommentsWithUser {
    id?: number,
    body: string,
    userId?: number | null,
    recipeId?: number,
    name: string
}