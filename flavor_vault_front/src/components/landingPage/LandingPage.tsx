import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { jwtDecode } from "jwt-decode";
import secureLocalStorage from "react-secure-storage";

import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import { BsStar } from "react-icons/bs";

import classes from "./LandingPage.module.css";
import NavBar from "../navbar/NavBar";
import instanceJwt from "../../helper/AxiosInstanceJWT";
import { UserFavorite } from "../../models/UserFavorite";
import { UserToken } from "../../models/UserToken";
import { Spinner } from "react-bootstrap";
import { Recipe } from "../../models/Recipe";
import { useNavigate } from "react-router-dom";

const LandingPage: React.FC = () => {
  const Id = useRef<number | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const [searchResults, setSearchResults] = useState<Recipe[]>([]);
  const [userFavorites, setUserFavorites] = useState<UserFavorite[]>([]);
  const [modal, showModal] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [alert, setAlert] = useState<{
    type: string;
    message: string;
  } | null>(null);

  const navigate = useNavigate();

  const handleGoToRecipe = useCallback((id: number) => {
    navigate(`/recipe/${id}`);
  }, [navigate]);

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

  const handleCloseModal = useCallback(() => {
    showModal(false);
  }, []);

  const getUserFavorites = useCallback(() => {
    if (Id.current != null) {
      instanceJwt
        .get(`Favorite/getFavoritesByUser?Id=${Id.current}`)
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
        Id.current = decodedToken.nameid;
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
                    {searchResults
                      .slice(index, index + 4)
                      .map((result, idx) => (
                        <Col key={idx} xs={12} sm={6} md={4} lg={3}>
                          <Card className={classes.card}>
                            <Card.Img variant="top" src="/assets/default.jpg" />
                            <Card.Body>
                              <Card.Title>{result.title}</Card.Title>
                              <Card.Text>
                                {result.body.map((item, index) => (
                                  <span key={index}>
                                    {item}
                                    <br />
                                  </span>
                                ))}
                              </Card.Text>
                              <Button
                                onClick={() => {
                                  console.log(result);
                                  handleGoToRecipe(result.id!);
                                }}
                                className={classes.recipeButton}
                              >
                                Go to recipe
                              </Button>
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
            <p className={classes.noResultText}>No results found.</p>
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
                            <Col key={idx} xs={12} sm={6} md={4} lg={3}>
                              <Card className={classes.card}>
                                <Card.Img
                                  variant="top"
                                  src="/assets/default.jpg"
                                />
                                <Card.Body>
                                  <Card.Title>{fav.title}</Card.Title>
                                  <Card.Text>
                                    {fav.body.map((item, index) => (
                                      <span key={index}>
                                        {item}
                                        <br />
                                      </span>
                                    ))}
                                  </Card.Text>
                                  <Button
                                    onClick={() => {
                                      handleGoToRecipe(favorites.id!);
                                    }}
                                    className={classes.recipeButton}
                                  >
                                    Go to recipe
                                  </Button>
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
