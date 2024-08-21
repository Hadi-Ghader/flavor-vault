import React, { useCallback, useEffect, useRef, useState } from "react";

import { jwtDecode } from "jwt-decode";
import secureLocalStorage from "react-secure-storage";
import {
  storage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "../../helper/Firebase";

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
import { useNavigate } from "react-router-dom";

const RecipeUpload: React.FC = () => {
  const [hasToken, setHasToken] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [imageName, setImageName] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category>({
    id: 0,
    name: "Select Category",
  });
  const userId = useRef<number>();
  const [alert, setAlert] = useState<{
    type: string;
    message: string;
  } | null>(null);

  const navigate = useNavigate();

  const inputTitleRef = useRef<HTMLInputElement | null>(null);
  const inputBodyRef = useRef<HTMLTextAreaElement | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);

  const getAllCategories = useCallback(() => {
    instance
      .get<Category[]>("/Category/getallcategories")
      .then((alert) => {
        setCategories(alert.data);
      })
      .catch((error) => {
        setAlert({
          type: "danger",
          message: error.response.data.message || "Could not get categories.",
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const handleRecipeUpload = useCallback(async () => {
    if (
      inputTitleRef.current?.value === "" ||
      inputBodyRef.current?.value === "" ||
      selectedCategory.id === 0
    ) {
      let message = "Please fill out the following fields: ";
      if (inputTitleRef.current?.value === "") message += "Title ";
      if (inputBodyRef.current?.value === "") message += "Body ";
      if (selectedCategory.id === 0) message += "Category ";

      setAlert({ type: "danger", message: message.trim() });
      return;
    }

    const bodyText = inputBodyRef.current!.value;
    const bodyList = bodyText.split("\n");
    let imageUrl =
      "https://firebasestorage.googleapis.com/v0/b/flavor-vault.appspot.com/o/default-image.jpg?alt=media&token=86878369-3545-4611-a735-7238d7da1829";

    if (imageInputRef.current && imageInputRef.current.files?.length) {
      const file = imageInputRef.current.files[0];
      setImageName("");
      const storageRef = ref(storage, `images/${file.name}`);
      await uploadBytes(storageRef, file);
      imageUrl = await getDownloadURL(storageRef);
    }

    let recipe: Recipe = {
      title: inputTitleRef.current!.value,
      body: bodyList,
      userId: userId.current!,
      categoryId: selectedCategory.id,
      imageUrl: imageUrl,
    };

    instanceJwt
      .post("Recipe/uploadrecipe", recipe)
      .then((response) => {
        navigate(`/recipe/${response.data.recipe.id}`);
        setAlert({ type: "success", message: response.data.message });
        inputTitleRef.current!.value = "";
        inputBodyRef.current!.value = "";
        imageInputRef.current!.value = "";
        setSelectedCategory({ id: 0, name: "Select Category" });
      })
      .catch((error) => {
        console.log(error);
        setAlert({
          type: "danger",
          message: error.response.data.message || "Could not add recipe.",
        });
      });
  }, [
    selectedCategory.id,
    userId,
    inputTitleRef,
    inputBodyRef,
    imageInputRef,
    navigate,
  ]);

  useEffect(() => {
    const token = secureLocalStorage.getItem("token") as string;

    if (typeof token === "string") {
      try {
        setHasToken(true);
        const decodedToken: UserToken = jwtDecode(token);

        userId.current = decodedToken.nameid;
        getAllCategories();
      } catch (error) {
        setAlert({
          type: "danger",
          message: "Invalid token.",
        });
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

  const handleFileChange = useCallback(() => {
    if (imageInputRef.current && imageInputRef.current.files?.length) {
      const file = imageInputRef.current.files[0];
      setImageName(file.name);
    }
  }, []);

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
            {alert && <Alert variant={alert.type}>{alert.message}</Alert>}
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

            <div>
              <label
                htmlFor="image-upload"
                className={classes.customImageUpload}
              >
                <div>Upload Image </div>
              </label>
              {imageName && (
                <div className={classes.imageName}>
                  Selected Image: {imageName}
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                ref={imageInputRef}
                id="image-upload"
                className={classes.inputImage}
                onChange={handleFileChange}
              />
            </div>
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
