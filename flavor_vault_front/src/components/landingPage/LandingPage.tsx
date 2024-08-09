import { useCallback, useEffect, useRef, useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import secureLocalStorage from "react-secure-storage";
import instanceJwt from "../../helper/AxiosInstanceJWT";

import {
  Container,
  Row,
  Col,
  Form,
  Modal,
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

import classes from "./LandingPage.module.css";

import { UserFavorite } from "../../models/UserFavorite";
import { UserToken } from "../../models/UserToken";
import { Recipe } from "../../models/Recipe";
import { Like } from "../../models/Like";

const LandingPage: React.FC = () => {
  const userId = useRef<number | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const [imageLoading, setImageLoading] = useState<{ [key: number]: boolean }>(
    {}
  );
  const [searchResults, setSearchResults] = useState<Recipe[]>([]);
  const [userFavorites, setUserFavorites] = useState<UserFavorite[]>([]);
  const [modal, showModal] = useState<boolean>(false);
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

  const handleSearch = useCallback((event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = searchRef.current!.value;
    if (searchRef.current!.value !== null) {
      instanceJwt
        .get(`Recipe/search?query=${query}`)
        .then((response) => {
          setSearchResults(response.data);
          setIsLoading(false);
          showModal(true);
        })
        .catch((error) => {
          console.log("Error searching recipes", error);
          setIsLoading(false);
        });
    }
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
        console.log(error);
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
          console.log(error);
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
          console.log(error);
        });
    }
  }, []);

  const handleCloseModal = useCallback(() => {
    showModal(false);
  }, []);

  const getUserFavorites = useCallback(() => {
    if (userId.current != null) {
      instanceJwt
        .get(`Favorite/getUserFavoritesWithLikes?userId=${userId.current}`)
        .then((response) => {
          setUserFavorites(response.data);
          setIsLoading(false);
        })
        .catch((exception) => {
          console.log(exception);
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
        const decodedToken: UserToken = jwtDecode(token);
        userId.current = decodedToken.nameid;
        getUserFavorites();
      } catch (error) {
        console.log("Invalid Token", error);
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

      <Modal
        show={modal}
        onHide={handleCloseModal}
        dialogClassName={classes.modalContainer}
      >
        <Modal.Header closeButton>
          <Modal.Title className={classes.searchTitle}>
            Search Results
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {searchResults.length > 0 ? (
            searchResults.map((result, index) => {
              if (index % 4 === 0) {
                return (
                  <Row key={index} className="mb-4">
                    {searchResults.slice(index, index + 4).map((result) => (
                      <Col key={result.id} xs={12} sm={6} md={4} lg={3}>
                        <Card className={classes.card}>
                          {imageLoading[result.id!] ? (
                            <Spinner
                              animation="border"
                              role="status"
                              className={classes.loading}
                            />
                          ) : (
                            <Card.Img
                              className={classes.cardImage}
                              variant="top"
                              src={result.imageUrl}
                              onLoad={() => handleImageLoad(result.id!)}
                            />
                          )}
                          <Card.Body className={classes.cardBody}>
                            <Card.Title>{result.title}</Card.Title>
                            <Card.Text className={classes.cardText}>
                              {result.body.length > 3 ? (
                                <div>
                                  {result.body
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
                                result.body.map((item, index) => (
                                  <span key={index}>
                                    {item}
                                    <br />
                                  </span>
                                ))
                              )}
                            </Card.Text>
                            <div className={classes.buttonContainer}>
                              <Button
                                onClick={() => handleGoToRecipe(result.id!)}
                                className={classes.recipeButton}
                              >
                                <FaArrowCircleRight />
                              </Button>
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                );
              }
              return null;
            })
          ) : (
            <div className={classes.noResultText}>No results found.</div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button className={classes.closeButton} onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Form onSubmit={handleSearch} className="d-flex">
        <Form.Control
          id="search"
          type="search"
          placeholder="Search for a recipe"
          className={`${classes.searchBar} me-2`}
          aria-label="Search"
          ref={searchRef}
        />
      </Form>

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
                              key={fav.recipeId}
                              xs={12}
                              sm={6}
                              md={4}
                              lg={3}
                            >
                              <Card className={classes.card}>
                                {imageLoading[fav.recipeId] ? (
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
                                  <Card.Title>{fav.title}</Card.Title>
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

export default LandingPage;
