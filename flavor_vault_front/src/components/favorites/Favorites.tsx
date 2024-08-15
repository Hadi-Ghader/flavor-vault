import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import secureLocalStorage from "react-secure-storage";
import instanceJwt from "../../helper/AxiosInstanceJWT";

import {
  Container,
  Row,
  Col,
  Button,
  Alert,
  Spinner,
  Card,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { BsStar } from "react-icons/bs";
import { FaArrowCircleRight, FaRegHeart } from "react-icons/fa";
import { FaHeart, FaBookmark } from "react-icons/fa6";

import NavBar from "../navbar/NavBar";

import classes from "./Favorites.module.css";

import { UserFavorite } from "../../models/UserFavorite";
import { UserToken } from "../../models/UserToken";
import { Like } from "../../models/Like";

const Favorites: React.FC = () => {
  const userId = useRef<number | null>(null);
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const [imageLoading, setImageLoading] = useState<{ [key: number]: boolean }>(
    {}
  );
  const [userFavorites, setUserFavorites] = useState<UserFavorite[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [alert, setAlert] = useState<{
    type: string;
    message: string;
  } | null>(null);

  const navigate = useNavigate();

  const handleGoToRecipe = useCallback(
    (id: number) => {
      navigate(`/recipe/${id}`);
    },
    [navigate]
  );

  const handleImageLoad = useCallback((id: number) => {
    setImageLoading((prevLoading) => ({ ...prevLoading, [id]: false }));
  }, []);

  const handleRemoveFromFavoritesButton = useCallback((recipeId: number) => {
    instanceJwt
      .delete(
        `Favorite/removeFavorite?userId=${userId.current}&recipeId=${recipeId}`
      )
      .then((response) => {
        setUserFavorites((prevFavorites) =>
          prevFavorites.filter((fav) => fav.recipeId !== recipeId)
        );
      })
      .catch((error) => {
        setAlert({
          type: "danger",
          message:
            error.response.data.message || "An unexpected error occurred",
        });
      });
  }, []);

  const handleLikeButton = useCallback((recipeId: number, liked: boolean) => {
    if (!liked) {
      let like: Like = {
        UserId: userId.current!,
        RecipeId: recipeId,
      };

      instanceJwt
        .post("RecipeInteraction/addLike", like)
        .then((response) => {
          setUserFavorites((prevFavorites) =>
            prevFavorites.map((fav) =>
              fav.recipeId === recipeId ? { ...fav, isLiked: true } : fav
            )
          );
        })
        .catch((error) => {
          setAlert({
            type: "danger",
            message: error.response.data.message || "Could not add the like",
          });
        });
    } else {
      instanceJwt
        .delete(
          `RecipeInteraction/removeLike?userId=${userId.current}&recipeId=${recipeId}`
        )
        .then((response) => {
          setUserFavorites((prevFavorites) =>
            prevFavorites.map((fav) =>
              fav.recipeId === recipeId ? { ...fav, isLiked: false } : fav
            )
          );
        })
        .catch((error) => {
          setAlert({
            type: "danger",
            message: error.response.data.message || "Could not remove the like",
          });
        });
    }
  }, []);

  const getUserFavorites = useCallback(() => {
    if (userId.current != null) {
      instanceJwt
        .get(`Favorite/getUserFavoritesWithLikes?userId=${userId.current}`)
        .then((response) => {
          setUserFavorites(response.data);
        })
        .catch((error) => {
          setAlert({
            type: "danger",
            message:
              error.response.data.message || "Could not get user favorites",
          });
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = secureLocalStorage.getItem("token") as string;
    if (typeof token === "string") {
      try {
        setIsDisabled(false);
        const decodedToken: UserToken = jwtDecode(token);
        userId.current = decodedToken.nameid;
        getUserFavorites();
      } catch (error) {
        setIsDisabled(true);
        setAlert({
          type: "danger",
          message: "Invalid Token",
        });
        setIsLoading(false);
      }
    } else {
      setAlert({
        type: "danger",
        message: "Please login to view your favorites!",
      });
      setIsLoading(false);
    }
  }, [getUserFavorites]);

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

      {alert && (
        <Alert className={classes.alert} variant={alert.type}>
          {alert.message}
        </Alert>
      )}

      {!alert && (
        <div>
          {userFavorites.length > 0 ? (
            <h2 className={classes.heading}>
              Your Favorites{" "}
              <div className={classes.icon}>
                <BsStar color="var(--main-green)" />
              </div>
            </h2>
          ) : (
            <h2 className={classes.heading}>
              You don't have any favorites. Start by adding some!{" "}
            </h2>
          )}

          <Container className={classes.cardsContainer}>
            {userFavorites.length > 0 && (
              <div>
                {userFavorites.map((favorites, index) => {
                  if (index % 4 === 0) {
                    return (
                      <Row key={index} className="mb-4">
                        {userFavorites
                          .slice(index, index + 4)
                          .map((fav, idx) => (
                            <Col
                              key={`${fav.id}-${idx}`}
                              xs={12}
                              sm={6}
                              md={4}
                              lg={3}
                            >
                              <Card className={classes.card}>
                                {imageLoading[fav.id] ? (
                                  <Spinner
                                    animation="border"
                                    role="status"
                                    className={classes.loading}
                                  />
                                ) : (
                                  <Card.Img
                                    className={classes.cardImage}
                                    variant="top"
                                    src={fav.imageUrl}
                                    onLoad={() => handleImageLoad(fav.id)}
                                  />
                                )}

                                <Card.Body className={classes.cardBody}>
                                  <Card.Title className={classes.cardTitle}>
                                    {fav.title}
                                  </Card.Title>
                                  <Card.Text className={classes.cardText}>
                                    {fav.body.length > 3 ? (
                                      <div>
                                        {fav.body
                                          .slice(0, 3)
                                          .map((item, index) => (
                                            <span key={index}>
                                              {item}
                                              <br />
                                            </span>
                                          ))}
                                        <span className={classes.ellipsis}>
                                          ...more
                                        </span>
                                      </div>
                                    ) : (
                                      fav.body.map((item, index) => (
                                        <span key={index}>
                                          {item}
                                          <br />
                                        </span>
                                      ))
                                    )}
                                  </Card.Text>
                                  <div className={classes.buttonContainer}>
                                    <OverlayTrigger
                                      key={`like-${fav.id}-${idx}`}
                                      placement="top"
                                      overlay={
                                        <Tooltip
                                          id={`tooltip-like-${fav.recipeId}`}
                                        >
                                          {fav.isLiked ? "Unlike" : "Like"}
                                        </Tooltip>
                                      }
                                    >
                                      <Button
                                        disabled={isDisabled}
                                        onClick={() => {
                                          handleLikeButton(
                                            fav.recipeId,
                                            fav.isLiked
                                          );
                                        }}
                                        className={classes.recipeButton}
                                      >
                                        {fav.isLiked ? (
                                          <FaHeart />
                                        ) : (
                                          <FaRegHeart />
                                        )}
                                      </Button>
                                    </OverlayTrigger>

                                    <OverlayTrigger
                                      key={`bookmark-${fav.id}-${idx}`}
                                      placement="top"
                                      overlay={
                                        <Tooltip
                                          id={`tooltip-bookmark-${fav.recipeId}`}
                                        >
                                          Remove
                                        </Tooltip>
                                      }
                                    >
                                      <Button
                                        disabled={isDisabled}
                                        onClick={() => {
                                          handleRemoveFromFavoritesButton(
                                            fav.recipeId
                                          );
                                        }}
                                        className={classes.recipeButton}
                                      >
                                        <FaBookmark />
                                      </Button>
                                    </OverlayTrigger>

                                    <OverlayTrigger
                                      key={`go-to-recipe-${fav.id}`}
                                      placement="top"
                                      overlay={
                                        <Tooltip
                                          id={`tooltip-go-to-recipe-${fav.recipeId}`}
                                        >
                                          Go to recipe
                                        </Tooltip>
                                      }
                                    >
                                      <Button
                                        onClick={() => {
                                          handleGoToRecipe(fav.recipeId);
                                        }}
                                        className={classes.recipeButton}
                                      >
                                        <FaArrowCircleRight />
                                      </Button>
                                    </OverlayTrigger>
                                  </div>
                                </Card.Body>
                              </Card>
                            </Col>
                          ))}
                      </Row>
                    );
                  }
                  return null;
                })}
              </div>
            )}
          </Container>
        </div>
      )}
    </div>
  );
};

export default Favorites;
