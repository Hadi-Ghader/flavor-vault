import React, { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";
import { jwtDecode } from "jwt-decode";
import { Toast, ToastContainer } from "react-bootstrap";
import classes from "./InputComment.module.css";
import { UserToken } from "../../models/UserToken";
import { CommentModel } from "../../models/CommentModel";
import instanceJwt from "../../helper/AxiosInstanceJWT";
import { CommentSectionHandle } from "../commentssection/CommentsSection";

interface InputCommentProps {
  commentSectionRef: React.RefObject<CommentSectionHandle>;
}

const InputComment: React.FC<InputCommentProps> = ({ commentSectionRef }) => {
  const { recipeId } = useParams<{ recipeId: string }>();
  const [tokenExists, setTokenExists] = useState<boolean>(false);
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    variant: "success" | "error";
  }>({
    show: false,
    message: "",
    variant: "success",
  });

  const inputCommentRef = useRef<HTMLTextAreaElement>(null);
  const userId = useRef<number | null>(null);

  useEffect(() => {
    const token = secureLocalStorage.getItem("token") as string;
    if (token) {
      setTokenExists(true);

      const decodedToken: UserToken = jwtDecode(token);
      userId.current = decodedToken.nameid;
    } else {
      setTokenExists(false);
    }
  }, []);

  const handleSubmitComment = useCallback(() => {
    if (recipeId && inputCommentRef.current) {
      const id = parseInt(recipeId);
      const commentBody = inputCommentRef.current.value;

      let comment: CommentModel = {
        body: commentBody,
        userId: userId.current!,
        recipeId: id,
      };

      commentSectionRef.current?.addComment(commentBody);

      instanceJwt
        .post(`RecipeInteraction/addComment`, comment)
        .then(() => {
          setToast({
            show: true,
            message: "Comment added successfully!",
            variant: "success",
          });
          inputCommentRef.current!.value = "";
        })
        .catch(() => {
          setToast({
            show: true,
            message: "There was an error adding your comment.",
            variant: "error",
          });
        });
    }
  }, [recipeId, commentSectionRef]);

  const handleSubmitKey = useCallback(
    (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key === "Enter") {
        event.preventDefault();
        handleSubmitComment();
      }
    },
    [handleSubmitComment]
  );

  return (
    <div className={classes.commentInputContainer}>
      {tokenExists ? (
        <>
          <label htmlFor="comment" className={classes.commentLabel}>
            Leave a Comment
          </label>
          <textarea
            id="comment"
            className={classes.commentInput}
            placeholder="Write your comment here..."
            ref={inputCommentRef}
            onKeyDown={handleSubmitKey}
          />
          <button
            className={classes.commentButton}
            onClick={handleSubmitComment}
          >
            Submit
          </button>
        </>
      ) : null}

      <ToastContainer position="top-end" className="p-3">
        <Toast
          show={toast.show}
          onClose={() => setToast((prev) => ({ ...prev, show: false }))}
          bg={toast.variant === "success" ? "success" : "danger"}
          delay={3000}
          autohide
          style={{
            backgroundColor:
              toast.variant === "success" ? "var(--main-green)" : "#f8d7da",
          }}
        >
          <Toast.Body
            style={{
              color: "var(--side-color)",
            }}
          >
            {toast.message}
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
};

export default InputComment;
