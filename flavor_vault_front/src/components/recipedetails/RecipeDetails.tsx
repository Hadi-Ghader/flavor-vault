import React, { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

import { jwtDecode } from "jwt-decode";
import secureLocalStorage from "react-secure-storage";

import { FaRegHeart } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";
import { Alert, Button, Card, Spinner } from "react-bootstrap";

import classes from "./RecipeDetails.module.css";
import instanceJwt from "../../helper/AxiosInstanceJWT";
import NavBar from "../navbar/NavBar";
import { RecipeWithLikes } from "../../models/RecipeWithLikes";
import { UserToken } from "../../models/UserToken";
import { Like } from "../../models/Like";
import LikeCounter from "../likecounter/LikeCounter";

const RecipeDetails: React.FC = () => {
  const { recipeId } = useParams<{ recipeId: string }>();
  const userId = useRef<number | null>(null);
  const [likesCount, setLikesCount] = useState<number>(0);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [recipeWithLike, setRecipeWithLike] = useState<RecipeWithLikes | null>(
    null
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [alert, setAlert] = useState<{
    variant: string;
    message: string;
  } | null>(null);

  const handleLikeButton = useCallback(() => {
    if (recipeId) {
      const id = parseInt(recipeId);

      if (!isLiked) {
        let like: Like = {
          UserId: userId.current,
          RecipeId: id,
        };

        instanceJwt
          .post("RecipeInteraction/addLike", like)
          .then((response) => {
            setIsLiked(true);
            setLikesCount((prevCount) => prevCount + 1);
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        instanceJwt
          .delete(
            `RecipeInteraction/removeLike?userId=${userId.current}&recipeId=${id}`
          )
          .then((response) => {
            console.log(response);
            setIsLiked(false);
            setLikesCount((prevCount) => prevCount - 1);
          })
          .catch((error) => {
            console.log(error);
          });
      }
    }
  }, [isLiked]);

  useEffect(() => {
    const token = secureLocalStorage.getItem("token") as string;
    try {
      const decodedToken: UserToken = jwtDecode(token);
      userId.current = decodedToken.nameid;
    } catch (error) {
      console.log("Invalid Token", error);
      setIsLoading(false);
    }

    if (recipeId) {
      const id = parseInt(recipeId);
      instanceJwt
        .get(`Recipe/getRecipeById?id=${id}`)
        .then((response) => {
          setRecipeWithLike(response.data);
          setLikesCount(response.data.likesCount);
          setIsLoading(false);
        })
        .catch((error) => {
          setAlert({ variant: "danger", message: `${error.response.data}` });
          setIsLoading(false);
          console.log(error);
        });
      instanceJwt
        .get(
          `RecipeInteraction/userHasLiked?userId=${userId.current}&recipeId=${recipeId}`
        )
        .then((response) => {
          if (response.data === true) {
            setIsLiked(true);
          } else {
            setIsLiked(false);
          }
        })
        .catch((error) => {
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
      {recipeWithLike && (
        <div className={classes.recipeDetailsContainer}>
          <Card className={classes.cardContainer}>
            <Card.Img
              className={classes.image}
              variant="top"
              src="/assets/default.jpg"
            />
            <Card.Body>
              <Card.Title>{recipeWithLike.recipe.title}</Card.Title>
              <Card.Text>
                {recipeWithLike.recipe.body.map((item, index) => (
                  <span key={index}>
                    {item}
                    <br />
                  </span>
                ))}
              </Card.Text>
              <Button onClick={handleLikeButton} className={classes.likeButton}>
                {isLiked ? <FaHeart /> : <FaRegHeart />}
              </Button>

              <LikeCounter likesCount={likesCount} />
            </Card.Body>
          </Card>
        </div>
      )}
    </div>
  );
};

export default RecipeDetails;
