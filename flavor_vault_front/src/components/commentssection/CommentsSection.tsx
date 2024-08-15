import React, { useCallback, useEffect, useRef, useState } from "react";

import instanceJwt from "../../helper/AxiosInstanceJWT";
import secureLocalStorage from "react-secure-storage";
import { jwtDecode } from "jwt-decode";

import {
  Alert,
  Spinner,
  Pagination,
  Button,
  Toast,
  ToastContainer,
  Tooltip,
  OverlayTrigger,
} from "react-bootstrap";
import { MdDelete } from "react-icons/md";

import classes from "./CommentsSection.module.css";

import { CommentsWithUser } from "../../models/CommentsWithUser";
import { UserToken } from "../../models/UserToken";
import { useParams } from "react-router-dom";
import instance from "../../helper/AxiosInstance";

const CommentSection: React.FC = () => {
  const { recipeId } = useParams<{ recipeId: string }>();
  const [comments, setComments] = useState<CommentsWithUser[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [alert, setAlert] = useState<{
    type: string;
    message: string;
  } | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [commentsPerPage] = useState<number>(5);
  const [totalComments, setTotalComments] = useState<number>(0);

  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    variant: string;
  }>({ show: false, message: "", variant: "" });

  const userId = useRef<number | null>(null);

  useEffect(() => {
    setIsLoading(true);

    const token = secureLocalStorage.getItem("token") as string;
    if (token) {
      try {
        const decodedToken: UserToken = jwtDecode(token);
        if (typeof decodedToken.nameid === "string") {
          userId.current = parseInt(decodedToken.nameid);
        } else {
          setAlert({ type: "danger", message: "nameid is not a string." });
          userId.current = null;
        }
      } catch (error) {
        setAlert({
          type: "danger",
          message: "An error occurred while decoding the token.",
        });
        userId.current = null;
      }
    }

    if (typeof recipeId === "string") {
      const rId = parseInt(recipeId);
      instance
        .get(
          `RecipeInteraction/getComments?recipeId=${rId}&page=${currentPage}&pageSize=${commentsPerPage}`
        )
        .then((response) => {
          console.log(response);
          if (response.data && Array.isArray(response.data.comments)) {
            setComments(response.data.comments);
            setTotalComments(response.data.totalCount);
          } else {
            setComments([]);
            setTotalComments(0);
            setAlert({
              type: "danger",
              message: "Unexpected API response format",
            });
          }
        })
        .catch((error) => {
          setComments([]);
          setTotalComments(0);
          setAlert({
            type: "danger",
            message: error.response.data.message || "Failed to load comments.",
          });
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [currentPage, commentsPerPage, recipeId]);

  const handleDeleteButton = useCallback((commentId: number) => {
    instanceJwt
      .delete(`RecipeInteraction/removeComment?id=${commentId}`)
      .then(() => {
        setToast({
          show: true,
          message: "Comment deleted successfully.",
          variant: "success",
        });
        setComments((prevComments) =>
          prevComments.filter((comment) => comment.id !== commentId)
        );
      })
      .catch(() => {
        setToast({
          show: true,
          message: "Error deleting comment.",
          variant: "danger",
        });
      });
  }, []);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  if (isLoading) {
    return <Spinner animation="border" role="status" />;
  }

  return (
    <div>
      {alert && <Alert variant={alert.type}>{alert.message}</Alert>}
      {comments.length > 0 ? (
        comments.map((comment) => (
          <div key={comment.id} className={classes.commentsContainer}>
            <h5 className={classes.commentTitle}>{comment.name}</h5>
            <p className={classes.commentBody}>
              {comment.body}{" "}
              <span>
                {userId.current === comment.userId && (
                  <OverlayTrigger
                    placement="top"
                    overlay={
                      <Tooltip id={`tooltip-like`}>Delete Comment</Tooltip>
                    }
                  >
                    <Button
                      onClick={() => handleDeleteButton(comment.id)}
                      className={classes.deleteButton}
                    >
                      <MdDelete />
                    </Button>
                  </OverlayTrigger>
                )}
              </span>
            </p>
          </div>
        ))
      ) : (
        <p>No comments available.</p>
      )}
      {comments.length > 0 && totalComments > commentsPerPage && (
        <Pagination className={classes.paginationContainer}>
          {Array.from(
            { length: Math.ceil(totalComments / commentsPerPage) },
            (_, index) => (
              <Pagination.Item
                key={index + 1}
                active={index + 1 === currentPage}
                onClick={() => paginate(index + 1)}
                className={classes.paginationButton}
              >
                {index + 1}
              </Pagination.Item>
            )
          )}
        </Pagination>
      )}
      <ToastContainer position="top-end" className="p-3">
        <Toast
          onClose={() => setToast((prev) => ({ ...prev, show: false }))}
          show={toast.show}
          delay={3000}
          autohide
          className={`position-fixed bottom-0 end-0 m-3 bg-${toast.variant}`}
        >
          <Toast.Body>{toast.message}</Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
};

export default CommentSection;
