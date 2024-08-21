import React, { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

import { jwtDecode } from "jwt-decode";
import secureLocalStorage from "react-secure-storage";

import { Alert, Col, Row, Spinner } from "react-bootstrap";

import classes from "./RecipeDetails.module.css";
import instanceJwt from "../../helper/AxiosInstanceJWT";
import NavBar from "../navbar/NavBar";
import { RecipeWithLikes } from "../../models/RecipeWithLikes";
import { UserToken } from "../../models/UserToken";
import { Like } from "../../models/Like";
import LikeCounter from "../likecounter/LikeCounter";
import LikeButton from "../likebutton/LikeButton";
import { Favorite } from "../../models/Favorite";
import FavoriteButton from "../favoritebutton/FavoriteButton";
import CommentSection, {
  CommentSectionHandle,
} from "../commentssection/CommentsSection";
import RatingSection from "../ratingsection/RatingSection";
import InputComment from "../inputcomment/InputComment";

const RecipeDetails: React.FC = () => {
  const { recipeId } = useParams<{ recipeId: string }>();
  const userId = useRef<number | null>(null);
  const commentSectionRef = useRef<CommentSectionHandle>(null);
  const recipeIdNumber = Number(recipeId);
  const [likesCount, setLikesCount] = useState<number>(0);
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [recipeWithLike, setRecipeWithLike] = useState<RecipeWithLikes | null>(
    null
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [alert, setAlert] = useState<{
    type: string;
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
            setAlert({
              type: "danger",
              message: error.response.data.message || "Could not add the like.",
            });
          });
      } else {
        instanceJwt
          .delete(
            `RecipeInteraction/removeLike?userId=${userId.current}&recipeId=${id}`
          )
          .then((response) => {
            setIsLiked(false);
            setLikesCount((prevCount) => prevCount - 1);
          })
          .catch((error) => {
            setAlert({
              type: "danger",
              message:
                error.response.data.message || "Could not remove the like.",
            });
          });
      }
    }
  }, [isLiked, userId, recipeId]);

  const handleFavoriteButton = useCallback(() => {
    if (recipeId) {
      const id = parseInt(recipeId);

      if (!isFavorite) {
        let favorite: Favorite = {
          userId: userId.current,
          recipeId: id,
        };

        instanceJwt
          .post("Favorite/addUserFavorite", favorite)
          .then((response) => {
            setIsFavorite(true);
          })
          .catch((error) => {
            setAlert({
              type: "danger",
              message:
                error.response.data.message || "Could not add to favorites.",
            });
          });
      } else {
        instanceJwt
          .delete(
            `Favorite/removeFavorite?userId=${userId.current}&recipeId=${id}`
          )
          .then((response) => {
            setIsFavorite(false);
          })
          .catch((error) => {
            setAlert({
              type: "danger",
              message:
                error.response.data.message ||
                "Could not remove from favorites.",
            });
          });
      }
    }
  }, [isFavorite, userId, recipeId]);

  useEffect(() => {
    const token = secureLocalStorage.getItem("token") as string;
    try {
      setIsDisabled(false);
      const decodedToken: UserToken = jwtDecode(token);
      userId.current = decodedToken.nameid;
    } catch (error) {
      setAlert({ type: "danger", message: "Invalid Token." });
      setIsLoading(false);
      setIsDisabled(true);
    }

    if (recipeId) {
      instanceJwt
        .get(`Recipe/getRecipeById?id=${recipeId}`)
        .then((response) => {
          setRecipeWithLike(response.data);
          setLikesCount(response.data.likesCount);
        })
        .catch((error) => {
          setAlert({
            type: "danger",
            message: error.response.data.message || "Could not get recipe.",
          });
        })
        .finally(() => {
          setIsLoading(false);
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
          setAlert({
            type: "danger",
            message:
              error.response.data.message ||
              "Please sign in to be able to like, add to favorite, comment, or rate.",
          });
        });

      instanceJwt
        .get(
          `Favorite/userHasFavorited?userId=${userId.current}&recipeId=${recipeId}`
        )
        .then((response) => {
          if (response.data === true) {
            setIsFavorite(true);
          } else {
            setIsFavorite(false);
          }
        })
        .catch((error) => {
          setAlert({
            type: "danger",
            message:
              error.response.data.message ||
              "Please sign in to be able to like, add to favorite, comment, or rate.",
          });
        });
    } else {
      setAlert({ type: "danger", message: "Invalid recipe ID." });
      setIsLoading(false);
    }
  }, [userId, recipeId]);

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
    <div>
      <NavBar />
      <div className={classes.mainContainer}>
        {alert && <Alert variant={alert.type}>{alert.message}</Alert>}
        {recipeWithLike && (
          <Row className={classes.customRow}>
            <Col xs={12} sm={12} md={12} lg={6} className={classes.imageCol}>
              <div className={classes.imageContainer}>
                <img
                  className={classes.image}
                  src={recipeWithLike.recipe.imageUrl}
                  alt={recipeWithLike.recipe.title}
                />
              </div>
            </Col>

            <Col xs={12} sm={12} md={12} lg={6} className={classes.contentCol}>
              <div className={classes.contentContainer}>
                <h2 className={classes.recipeTitle}>
                  {recipeWithLike.recipe.title}
                </h2>
                <h6 className={classes.recipeTitle}>
                  by: {recipeWithLike.recipe.userName}
                </h6>
                <div className={classes.recipeBody}>
                  {recipeWithLike.recipe.body.map((item, index) => (
                    <span key={index}>
                      {item}
                      <br />
                    </span>
                  ))}
                </div>
                <CommentSection ref={commentSectionRef} />
                <LikeCounter likesCount={likesCount} />
                <div className={classes.buttonContainer}>
                  <LikeButton
                    isDisabled={isDisabled}
                    isLiked={isLiked}
                    onClick={handleLikeButton}
                  />
                  <FavoriteButton
                    isFavorite={isFavorite}
                    onClick={handleFavoriteButton}
                    isDisabled={isDisabled}
                  />
                  <RatingSection
                    recipeId={recipeIdNumber}
                    userId={userId.current!}
                  />
                </div>
                <InputComment commentSectionRef={commentSectionRef} />
              </div>
            </Col>
          </Row>
        )}
      </div>
    </div>
  );
};

export default RecipeDetails;
