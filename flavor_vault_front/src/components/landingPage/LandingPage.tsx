import { useCallback, useEffect, useRef, useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import secureLocalStorage from "react-secure-storage";
import instanceJwt from "../../helper/AxiosInstanceJWT";
import debounce from "lodash.debounce";

import {
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
  Container,
} from "react-bootstrap";

import { FaArrowCircleRight, FaRegHeart } from "react-icons/fa";
import { FaHeart, FaBookmark } from "react-icons/fa6";
import { FaRegBookmark } from "react-icons/fa";

import NavBar from "../navbar/NavBar";

import classes from "./LandingPage.module.css";

import { UserToken } from "../../models/UserToken";
import { Recipe } from "../../models/Recipe";
import { Like } from "../../models/Like";
import instance from "../../helper/AxiosInstance";
import { Favorite } from "../../models/Favorite";

const LandingPage: React.FC = () => {
  const userId = useRef<number | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const [imageLoading, setImageLoading] = useState<{ [key: number]: boolean }>(
    {}
  );
  const [searchResults, setSearchResults] = useState<Recipe[]>([]);
  const [modal, showModal] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [alert, setAlert] = useState<{
    type: string;
    message: string;
  } | null>(null);

  const navigate = useNavigate();

  const getAllRecipesWithUserInteraction = useCallback(
    (userId: number | null) => {
      if (userId !== null) {
        instance
          .get(`Recipe/getAllRecipes?userId=${userId}`)
          .then((response) => {
            setRecipes(response.data);
          })
          .catch((error) => {
            setAlert(
              { type: "alert", message: error.response.data.message } ||
                "Could not get recipes"
            );
          })
          .finally(() => {
            setIsLoading(false);
          });
      } else {
        instance
          .get("Recipe/getAllRecipes")
          .then((response) => {
            setRecipes(response.data);
          })
          .catch((error) => {
            setAlert(
              { type: "alert", message: error.response.data.message } ||
                "Could not get recipes"
            );
          })
          .finally(() => {
            setIsLoading(false);
          });
      }
    },
    []
  );

  const handleGoToRecipe = useCallback(
    (id: number) => {
      navigate(`/recipe/${id}`);
    },
    [navigate]
  );

  const handleImageLoad = useCallback((id: number) => {
    setImageLoading((prevLoading) => ({ ...prevLoading, [id]: false }));
  }, []);

  const fetchSearchResults = useCallback(
    debounce((query: string) => {
      if (!query) return;
      setIsLoading(true);

      instance
        .get(`Recipe/search?query=${query}`)
        .then((response) => {
          setSearchResults(response.data);
          showModal(true);
        })
        .catch((error) => {
          setAlert(
            { type: "alert", message: error.response.data.message } ||
              "Could not get your search results"
          );
        })
        .finally(() => {
          setIsLoading(false);
        });
    }, 300),
    []
  );

  const handleSearch = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const query = searchRef.current!.value;
      if (searchRef.current!.value !== null) {
        fetchSearchResults(query);
      }
    },
    [fetchSearchResults]
  );

  const handleFavoritesButton = useCallback(
    (userId: number, recipeId: number, isFavorited: boolean) => {
      if (!isFavorited) {
        let userFavorite: Favorite = {
          userId: userId,
          recipeId: recipeId,
        };
        instanceJwt
          .post("Favorite/addUserFavorite", userFavorite)
          .then((response) => {
            setRecipes((prevRecipes) =>
              prevRecipes.map((rec) =>
                rec.id === recipeId ? { ...rec, isFavorited: true } : rec
              )
            );
          })
          .catch((error) => {
            setAlert(
              { type: "alert", message: error.response.data.message } ||
                "Could not add to favorites"
            );
          })
          .finally(() => {
            setIsLoading(false);
          });
      } else {
        instanceJwt
          .delete(
            `Favorite/removeFavorite?userId=${userId}&recipeId=${recipeId}`
          )
          .then((response) => {
            setRecipes((prevRecipes) =>
              prevRecipes.map((rec) =>
                rec.id === recipeId ? { ...rec, isFavorited: false } : rec
              )
            );
          })
          .catch((error) => {
            setAlert(
              { type: "alert", message: error.response.data.message } ||
                "Could not remove from favorites"
            );
          })
          .finally(() => {
            setIsLoading(false);
          });
      }
    },
    []
  );

  const handleLikeButton = useCallback(
    (userId: number, recipeId: number, isLiked: boolean) => {
      if (!isLiked) {
        let like: Like = {
          UserId: userId,
          RecipeId: recipeId,
        };

        instanceJwt
          .post("RecipeInteraction/addLike", like)
          .then((response) => {
            setRecipes((prevRecipes) =>
              prevRecipes.map((rec) =>
                rec.id === recipeId ? { ...rec, isLiked: true } : rec
              )
            );
          })
          .catch((error) => {
            setAlert(
              { type: "alert", message: error.response.data.message } ||
                "Could not add the like"
            );
          })
          .finally(() => {
            setIsLoading(false);
          });
      } else {
        instanceJwt
          .delete(
            `RecipeInteraction/removeLike?userId=${userId}&recipeId=${recipeId}`
          )
          .then((response) => {
            setRecipes((prevRecipes) =>
              prevRecipes.map((rec) =>
                rec.id === recipeId ? { ...rec, isLiked: false } : rec
              )
            );
          })
          .catch((error) => {
            setAlert(
              { type: "alert", message: error.response.data.message } ||
                "Could not delete the like"
            );
          })
          .finally(() => {
            setIsLoading(false);
          });
      }
    },
    []
  );

  const handleCloseModal = useCallback(() => {
    showModal(false);
  }, []);

  useEffect(() => {
    const token = secureLocalStorage.getItem("token") as string;
    if (typeof token === "string") {
      setIsDisabled(false);
      const decodedToken: UserToken = jwtDecode(token);
      userId.current = decodedToken.nameid;
      getAllRecipesWithUserInteraction(userId.current);
    } else {
      setIsLoading(false);
      setIsDisabled(true);
      getAllRecipesWithUserInteraction(null);
    }
  }, [getAllRecipesWithUserInteraction]);

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
                    {searchResults.slice(index, index + 4).map((res) => (
                      <Col
                        key={`${res.id}-${index}`}
                        xs={12}
                        sm={6}
                        md={6}
                        lg={3}
                      >
                        <Card className={classes.card}>
                          {imageLoading[res.id!] ? (
                            <Spinner
                              animation="border"
                              role="status"
                              className={classes.loading}
                            />
                          ) : (
                            <Card.Img
                              className={classes.cardImage}
                              variant="top"
                              src={res.imageUrl}
                              onLoad={() => handleImageLoad(res.id!)}
                            />
                          )}
                          <Card.Body className={classes.cardBody}>
                            <Card.Title className={classes.cardTitle}>
                              {res.title}
                            </Card.Title>
                            <Card.Text className={classes.cardText}>
                              {res.body.length > 3 ? (
                                <div>
                                  {res.body.slice(0, 3).map((item, index) => (
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
                                res.body.map((item, index) => (
                                  <span key={index}>
                                    {item}
                                    <br />
                                  </span>
                                ))
                              )}
                            </Card.Text>
                            <div className={classes.buttonContainer}>
                              <OverlayTrigger
                                key={`go-to-recipe-${res.id}`}
                                placement="top"
                                overlay={
                                  <Tooltip
                                    id={`tooltip-go-to-recipe-${res.id}`}
                                  >
                                    Go to recipe
                                  </Tooltip>
                                }
                              >
                                <Button
                                  onClick={() => {
                                    handleGoToRecipe(res.id!);
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

      {alert && <Alert variant={alert.type}>{alert.message}</Alert>}

      <Form onChange={handleSearch} className="d-flex">
        <Form.Control
          id="search"
          type="text"
          placeholder="Search for a recipe"
          className={`${classes.searchBar} me-2`}
          aria-label="Search"
          ref={searchRef}
        />
      </Form>

      <h2 className={classes.heading}>All Recipes</h2>

      <Container className={classes.cardsContainer}>
        {recipes.length > 0 && (
          <div>
            {recipes.map((recipe, index) => {
              if (index % 4 === 0) {
                return (
                  <Row key={index} className="mb-4">
                    {recipes.slice(index, index + 4).map((rec, idx) => (
                      <Col key={rec.id} xs={12} sm={6} md={4} lg={3}>
                        <Card className={classes.card}>
                          {imageLoading[rec.id!] ? (
                            <Spinner
                              animation="border"
                              role="status"
                              className={classes.loading}
                            />
                          ) : (
                            <Card.Img
                              className={classes.cardImage}
                              variant="top"
                              src={rec.imageUrl}
                              onLoad={() => handleImageLoad(rec.id!)}
                            />
                          )}

                          <Card.Body className={classes.cardBody}>
                            <Card.Title className={classes.cardTitle}>
                              {rec.title}
                            </Card.Title>
                            <Card.Text className={classes.cardText}>
                              {rec.body.length > 3 ? (
                                <div>
                                  {rec.body.slice(0, 3).map((item, index) => (
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
                                rec.body.map((item, index) => (
                                  <span key={index}>
                                    {item}
                                    <br />
                                  </span>
                                ))
                              )}
                            </Card.Text>
                            <div className={classes.buttonContainer}>
                              <OverlayTrigger
                                key={`like-${rec.id}-${idx}`}
                                placement="top"
                                overlay={
                                  <Tooltip id={`tooltip-like-${rec.id}`}>
                                    {rec.isLiked ? "Unlike" : "Like"}
                                  </Tooltip>
                                }
                              >
                                <Button
                                  disabled={isDisabled}
                                  onClick={() => {
                                    handleLikeButton(
                                      rec.userId!,
                                      rec.id!,
                                      rec.isLiked!
                                    );
                                  }}
                                  className={classes.recipeButton}
                                >
                                  {rec.isLiked ? <FaHeart /> : <FaRegHeart />}
                                </Button>
                              </OverlayTrigger>

                              <OverlayTrigger
                                key={`bookmark-${rec.id}-${idx}`}
                                placement="top"
                                overlay={
                                  <Tooltip id={`tooltip-bookmark-${rec.id}`}>
                                    {rec.isFavorited
                                      ? "Remove from favorites"
                                      : "Add to favorites"}
                                  </Tooltip>
                                }
                              >
                                <Button
                                  disabled={isDisabled}
                                  onClick={() => {
                                    handleFavoritesButton(
                                      rec.userId!,
                                      rec.id!,
                                      rec.isFavorited!
                                    );
                                  }}
                                  className={classes.recipeButton}
                                >
                                  {rec.isFavorited ? (
                                    <FaBookmark />
                                  ) : (
                                    <FaRegBookmark />
                                  )}
                                </Button>
                              </OverlayTrigger>

                              <OverlayTrigger
                                key={`go-to-recipe-${rec.id}-${idx}`}
                                placement="top"
                                overlay={
                                  <Tooltip
                                    id={`tooltip-go-to-recipe-${rec.id}`}
                                  >
                                    Go to recipe
                                  </Tooltip>
                                }
                              >
                                <Button
                                  onClick={() => {
                                    handleGoToRecipe(rec.id!);
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

      <h2 className={classes.heading}>All Recipes</h2>
    </div>
  );
};

export default LandingPage;
