import React from "react";
import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";
import classes from "./FavoriteButton.module.css";

interface FavoriteButtonProps {
  isFavorite: boolean;
  onClick: () => void;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  isFavorite,
  onClick,
}) => {
  return (
    <OverlayTrigger
      placement="top"
      overlay={
        <Tooltip id={`tooltip-like`}>
          {isFavorite ? "Add to favorites" : "Remove from favorites"}
        </Tooltip>
      }
    >
      <Button onClick={onClick} className={classes.favoriteButton}>
        {isFavorite ? <FaBookmark /> : <FaRegBookmark />}
      </Button>
    </OverlayTrigger>
  );
};

export default FavoriteButton;
