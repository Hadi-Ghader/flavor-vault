import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";

import classes from "./SignUp.module.css";
import { UserSignUp } from "../../models/UserSignUp";


import instance from "../../helper/AxiosInstance";

const SignUp: React.FC = () => {
  const [alert, setAlert] = useState<string | null>(null);

  const navigate = useNavigate();

  const inputNameRef = useRef<HTMLInputElement>(null);
  const inputEmailRef = useRef<HTMLInputElement>(null);
  const inputPasswordRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (secureLocalStorage.getItem("token")) {
      navigate("/");
    }
  }, [navigate]);

  const postUser = useCallback(
    (user: UserSignUp) => {
      instance
        .post("User/signup", user)
        .then((response) => {
          const { token } = response.data;
          secureLocalStorage.setItem("token", token);

          navigate("/");
        })
        .catch((exception) => {
          const { details } = exception.response.data;
          setAlert(details);
        });
    },
    [navigate]
  );

  const handleSignUpSubmit = useCallback(
    (event: React.FormEvent<HTMLButtonElement>) => {
      event.preventDefault();

      const emailPattern =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

      let name = inputNameRef.current!.value;
      let email = inputEmailRef.current!.value;
      let password = inputPasswordRef.current!.value;

      if (name === "" || email === "" || password === "") {
        let message = "Please fill out the following fields: ";
        if (name === "") message += "Name ";
        if (email === "") message += "Email ";
        if (password === "") message += "Password ";
        setAlert(message.trim());
        return;
      }

      if (!emailPattern.test(email)) {
        setAlert("Please enter a valid email address");
        return;
      }

      if (password.length < 8) {
        setAlert("Password must have at least 8 characters");
        return;
      }

      const user: UserSignUp = {
        name,
        email,
        password,
      };

      postUser(user);
    },

    [postUser]
  );

  return (
    <div className={classes.formDivContainer}>
      <video autoPlay loop muted className={classes.backgroundVideo}>
        <source src="/assets/background-video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <Form className={classes.signupFormContainer}>
        {alert && <Alert variant="danger">{alert}</Alert>}
        <Form.Group
          className={classes.signupNameContainer}
          controlId="formName"
        >
          <Form.Label
            className={
              alert && alert.includes("Name")
                ? classes.signupLabelError
                : classes.signupLabel
            }
          >
            Full Name
          </Form.Label>
          <Form.Control
            className={
              alert && alert.includes("Name")
                ? classes.signUpNameError
                : classes.signupNameInput
            }
            type="text"
            placeholder="Enter your full name"
            ref={inputNameRef}
          />
        </Form.Group>

        <Form.Group
          className={classes.signupEmailContainer}
          controlId="formEmail"
        >
          <Form.Label
            className={
              alert && alert.includes("Email")
                ? classes.signupLabelError
                : classes.signupLabel
            }
          >
            Email address
          </Form.Label>
          <Form.Control
            className={
              alert && alert.includes("Email")
                ? classes.signUpEmailError
                : classes.signupEmailnput
            }
            type="email"
            placeholder="Enter your email"
            ref={inputEmailRef}
          />
        </Form.Group>

        <Form.Group
          className={classes.signupPasswordContainer}
          controlId="formPassword"
        >
          <Form.Label
            className={
              alert && alert.includes("Password")
                ? classes.signupLabelError
                : classes.signupLabel
            }
          >
            Password
          </Form.Label>
          <Form.Control
            className={
              alert && alert.includes("Password")
                ? classes.signUpPasswordError
                : classes.signupPasswordInput
            }
            type="password"
            placeholder="Enter your password"
            ref={inputPasswordRef}
          />
        </Form.Group>

        <Link to="/login" className={classes.loginLink}>
          Already have an account? Login.
        </Link>

        <Button
          className={classes.formSubmitButton}
          type="button"
          onClick={handleSignUpSubmit}
        >
          Submit
        </Button>
      </Form>
    </div>
  );
};

export default SignUp;
