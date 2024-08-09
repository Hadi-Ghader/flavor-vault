export type Recipe = {
    id?: number
    title: string,
    body: string[],
    userId: number,
    categoryId: number
    imageUrl: string
    isLiked?: boolean
};