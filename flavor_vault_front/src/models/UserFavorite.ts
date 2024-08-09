export type UserFavorite = {
    id: number,
    recipeId: number,
    title: string,
    body: string[]
    imageUrl: string,
    isLiked: boolean
};