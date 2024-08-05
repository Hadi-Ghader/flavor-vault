import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { Recipe } from "../../models/Recipe";

const RecipeDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [recipe, setRecipe] = useState<Recipe | null>(null);

  useEffect(() => {
    if (id) {
      const recipeId = parseInt(id);
    }
  }, []);

  return <div>hello</div>;
};

export default RecipeDetails;
