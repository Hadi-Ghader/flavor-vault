import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { FaRegHeart } from "react-icons/fa";
import { Alert, Button, Card, Spinner } from "react-bootstrap";

import classes from "./RecipeDetails.module.css";
import { Recipe } from "../../models/Recipe";
import instanceJwt from "../../helper/AxiosInstanceJWT";
import NavBar from "../navbar/NavBar";

const RecipeDetails: React.FC = () => {
  const { recipeId } = useParams<{ recipeId: string }>();
  console.log(recipeId);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [alert, setAlert] = useState<{
    variant: string;
    message: string;
  } | null>(null);

  useEffect(() => {
    if (recipeId) {
      const id = parseInt(recipeId);
      instanceJwt
        .get(`Recipe/getRecipeById?id=${id}`)
        .then((response) => {
          setRecipe(response.data);
          setIsLoading(false);
          console.log(response);
        })
        .catch((error) => {
          setAlert({ variant: "danger", message: `${error.response.data}` });
          setIsLoading(false);
          console.log(error);
        });
    } else {
      setAlert({ variant: "danger", message: "Invalid recipe ID" });
      setIsLoading(false);
    }
  }, [recipeId]);

  if (isLoading) {
    return (
      <Spinner
        className={classes.loading}
        animation="border"
        role="status"
      ></Spinner>
    );
  }

  return (
    <div className={classes.mainContainer}>
      <NavBar />
      {alert && <Alert variant={alert.variant}>{alert.message}</Alert>}
      {recipe && (
        <div className={classes.recipeDetailsContainer}>
          <Card className={classes.cardContainer}>
            <Card.Img className={classes.image} variant="top" src="/assets/default.jpg" />
            <Card.Body>
              <Card.Title>{recipe.title}</Card.Title>
              <Card.Text>
                {recipe.body.map((item, index) => (
                  <span key={index}>
                    {item}
                    <br />
                  </span>
                ))}
              </Card.Text>
              <Button className={classes.likeButton}><FaRegHeart/></Button>
            </Card.Body>
          </Card>
        </div>
      )}
    </div>
  );
};

export default RecipeDetails;
