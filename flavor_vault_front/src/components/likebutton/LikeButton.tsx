import React from "react";
import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import classes from "./LikeButton.module.css";

interface LikeButtonProps {
  isLiked: boolean;
  isDisabled: boolean;
  onClick: () => void;
}

const LikeButton: React.FC<LikeButtonProps> = ({
  isLiked,
  isDisabled,
  onClick,
}) => (
  <OverlayTrigger
    placement="top"
    overlay={
      <Tooltip id={`tooltip-like`}>{isLiked ? "Unlike" : "Like"}</Tooltip>
    }
  >
    <Button
      disabled={isDisabled}
      onClick={onClick}
      className={classes.likeButton}
    >
      {isLiked ? <FaHeart /> : <FaRegHeart />}
    </Button>
  </OverlayTrigger>
);

export default LikeButton;
