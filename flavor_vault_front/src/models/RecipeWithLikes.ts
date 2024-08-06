import { Recipe } from "./Recipe";

export type RecipeWithLikes = {
    recipe: Recipe;
    likesCount: number;
};