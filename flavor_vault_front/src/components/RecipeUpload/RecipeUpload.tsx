import React, { useCallback, useEffect, useRef, useState } from "react";
import { jwtDecode } from "jwt-decode";
import secureLocalStorage from "react-secure-storage";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Dropdown from "react-bootstrap/Dropdown";
import Alert from "react-bootstrap/Alert";
import Spinner from "react-bootstrap/Spinner";

import classes from "./RecipeUpload.module.css";
import NavBar from "../navbar/NavBar";
import { Category } from "../../models/Category";
import { UserToken } from "../../models/UserToken";
import { Recipe } from "../../models/Recipe";
import instanceJwt from "../../helper/AxiosInstanceJWT";
import instance from "../../helper/AxiosInstance";
import NoTokenComponent from "../notokencomponent/NoTokenComponent";

const RecipeUpload: React.FC = () => {
  const [hasToken, setHasToken] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category>({
    id: 0,
    name: "Selected Category",
  });
  const userId = useRef<number>();
  const [response, setResponse] = useState<{
    type: string;
    message: string;
  } | null>(null);

  const inputTitleRef = useRef<HTMLInputElement>(null);
  const inputBodyRef = useRef<HTMLTextAreaElement>(null);
  const getAllCategories = useCallback(() => {
    instance
      .get<Category[]>("/Category/getallcategories")
      .then((response) => {
        setCategories(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching categories", error);
      });
  }, []);

  useEffect(() => {
    const token = secureLocalStorage.getItem("token") as string;

    if (typeof token === "string") {
      try {
        setHasToken(true);
        const decodedToken: UserToken = jwtDecode(token);

        userId.current = decodedToken.nameid;
        getAllCategories();
      } catch (error) {
        console.error("Invalid token:", error);
      }
    } else {
      setIsLoading(false);
    }
  }, [getAllCategories]);

  const handleSelectedCategory = useCallback(
    (categoryId: number, categoryName: string) => {
      setSelectedCategory({ id: categoryId, name: categoryName });
    },
    []
  );

  const handleRecipeUpload = useCallback(() => {
    if (
      inputTitleRef.current!.value === "" ||
      inputBodyRef.current!.value === "" ||
      selectedCategory.id === 0
    ) {
      let message = "Please fill out the following fields: ";
      if (inputTitleRef.current!.value === "") message += "Title ";
      if (inputBodyRef.current!.value === "") message += "Body ";
      if (selectedCategory.id === 0) message += "Category ";

      setResponse({ type: "danger", message: message.trim() });
      return;
    }

    const bodyText = inputBodyRef.current!.value;
    const bodyList = bodyText.split("\n");

    let recipe: Recipe = {
      title: inputTitleRef.current!.value,
      body: bodyList,
      userId: userId.current!,
      categoryId: selectedCategory.id,
    };

    instanceJwt
      .post("Recipe/uploadrecipe", recipe)
      .then((response) => {
        setResponse({ type: "success", message: response.data });
      })
      .catch((exception) => {
        console.log(exception);
        const { details } = exception.response.data;
        setResponse({ type: "danger", message: details });
      });
  }, [selectedCategory.id, userId]);

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
      <img
        src="/assets/upload-recipe-background-image.jpg"
        alt="Background"
        className={classes.backgroundImage}
      />
      {hasToken ? (
        <div>
          <NavBar />

          <Form className={classes.recipeFormContainer}>
            {response && (
              <Alert variant={response.type}>{response.message}</Alert>
            )}
            <Form.Group
              className={classes.recipeTitleInputContainer}
              controlId="formRecipeTitle"
            >
              <Form.Label className={classes.recipeLabel}>Title</Form.Label>
              <Form.Control
                className={classes.recipeTitleInput}
                type="text"
                placeholder="Enter title"
                ref={inputTitleRef}
              />
            </Form.Group>

            <Form.Group
              className={classes.recipeBodyInputContainer}
              controlId="formRecipeBody"
            >
              <Form.Label className={classes.recipeLabel}>Body</Form.Label>
              <Form.Control
                className={classes.recipeBodyInput}
                as="textarea"
                rows={5}
                placeholder="Enter Body"
                ref={inputBodyRef}
              />
            </Form.Group>

            <Dropdown>
              <Dropdown.Toggle
                className={classes.categoryDropDown}
                id="dropdown-basic"
              >
                {selectedCategory.name}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                {categories.map((category) => (
                  <Dropdown.Item
                    className={classes.categoryDropDownItem}
                    onClick={() =>
                      handleSelectedCategory(category.id, category.name)
                    }
                    key={category.id}
                  >
                    {category.name}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>

            <Button
              type="button"
              className={classes.formSubmitButton}
              onClick={handleRecipeUpload}
            >
              Submit
            </Button>
          </Form>
        </div>
      ) : (
        <NoTokenComponent />
      )}
    </div>
  );
};

export default RecipeUpload;
