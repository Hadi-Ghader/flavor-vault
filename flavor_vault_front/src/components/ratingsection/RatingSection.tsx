import React, { useCallback, useEffect, useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

import { Rating } from "../../models/Rating";
import instanceJwt from "../../helper/AxiosInstanceJWT";
import { Toast, ToastContainer } from "react-bootstrap";

import classes from "./RatingSection.module.css";
import instance from "../../helper/AxiosInstance";

interface RatingProps {
  recipeId: number;
  userId: number;
  initialRating?: Rating;
}

const RatingSection: React.FC<RatingProps> = ({
  recipeId,
  userId,
  initialRating,
}) => {
  const [averageRating, setAverageRating] = useState<number | null>(null);
  const [rating, setRating] = useState(initialRating?.starsCount || 0);
  const [hover, setHover] = useState(0);
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    variant: "success" | "error";
  }>({ show: false, message: "", variant: "success" });

  useEffect(() => {
    instanceJwt
      .get(
        `RecipeInteraction/getUserRatingForRecipe?userId=${userId}&recipeId=${recipeId}`
      )
      .then((response) => {
        setRating(response.data);
      })
      .catch((error) => {});

    instance
      .get(`RecipeInteraction/averageRating?recipeId=${recipeId}`)
      .then((response) => {
        setAverageRating(response.data);
      })
      .catch((error) => {
        setToast({
          show: true,
          message:
            error.response.data.message || "Failed to get average rating.",
          variant: "error",
        });
      });
  }, [recipeId, userId]);

  const handleRating = useCallback(
    (newRating: number) => {
      const ratingData: Rating = {
        starsCount: newRating,
        userId: userId,
        recipeId: recipeId,
      };

      instanceJwt
        .post("RecipeInteraction/addRating", ratingData)
        .then(() => {
          setRating(newRating);
          return instance.get(
            `RecipeInteraction/averageRating?recipeId=${recipeId}`
          );
        })
        .then((response) => {
          setAverageRating(response.data);
          setToast({
            show: true,
            message: "Rating submitted successfully!",
            variant: "success",
          });
        })
        .catch((error) => {
          setToast({
            show: true,
            message: error.response.data.message || "Failed to submit rating.",
            variant: "error",
          });
        });
    },
    [recipeId, userId]
  );

  return (
    <div>
      <ToastContainer position="top-end" className="p-3">
        <Toast
          show={toast.show}
          onClose={() => setToast((prev) => ({ ...prev, show: false }))}
          bg={toast.variant === "success" ? "success" : "danger"}
          delay={3000}
          autohide
        >
          <Toast.Body className="text-white">{toast.message}</Toast.Body>
        </Toast>
      </ToastContainer>

      <div className={classes.ratingContainer}>
        <span className={classes.averageRatingText}>
          Average Rating: {averageRating}
        </span>
        {[...Array(5)].map((_, index) => {
          const currentRating = index + 1;

          return (
            <FontAwesomeIcon
              key={index}
              icon={faStar}
              className={
                currentRating <= (hover || rating)
                  ? "star-filled"
                  : "star-empty"
              }
              onClick={() => handleRating(currentRating)}
              onMouseEnter={() => setHover(currentRating)}
              onMouseLeave={() => setHover(rating)}
              style={{
                cursor: "pointer",
                color:
                  currentRating <= (hover || rating) ? "#ffc107" : "#e4e5e9",
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

export default RatingSection;
