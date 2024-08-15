import React from "react";
import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";
import classes from "./FavoriteButton.module.css";

interface FavoriteButtonProps {
  isFavorite: boolean;
  isDisabled: boolean;
  onClick: () => void;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  isFavorite,
  isDisabled,
  onClick,
}) => {
  return (
    <OverlayTrigger
      placement="top"
      overlay={
        <Tooltip id={`tooltip-like`}>
          {isFavorite ? "Remove from favorites" : "Add to favorites"}
        </Tooltip>
      }
    >
      <Button
        disabled={isDisabled}
        onClick={onClick}
        className={classes.favoriteButton}
      >
        {isFavorite ? <FaBookmark /> : <FaRegBookmark />}
      </Button>
    </OverlayTrigger>
  );
};

export default FavoriteButton;
