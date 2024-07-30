import React, { useCallback, useEffect, useRef, useState } from "react";
import { UserLogin } from "../../models/UserLogin";
import { Link, useNavigate } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";

import classes from "./Login.module.css";
import instance from "../../helper/AxiosInstance";


const Login: React.FC = () => {
  const [alert, setAlert] = useState<string | null>(null);

  const navigate = useNavigate();

  const inputEmailRef = useRef<HTMLInputElement>(null);
  const inputPasswordRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (secureLocalStorage.getItem("token")) {
      navigate("/");
    }
  }, [navigate]);

  const postUser = useCallback(
    (user: UserLogin) => {
      instance
        .post("User/Login", user)
        .then((response) => {
          const { token } = response.data;
          secureLocalStorage.setItem("token", token);

          navigate("/");
        })
        .catch((error) => {
          const { details } = error.response.data;
          setAlert(details);
        });
    },
    [navigate]
  );

  const handleLogInSubmit = useCallback(
    (event: React.FormEvent<HTMLButtonElement>) => {
      event.preventDefault();

      const emailPattern =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

      let email = inputEmailRef.current!.value;
      let password = inputPasswordRef.current!.value;

      if (email === "" || password === "") {
        let message = "Please fill out the following fields: ";
        if (email === "") message += "Email ";
        if (password === "") message += "Password ";
        setAlert(message.trim());
        return;
      }

      if (!emailPattern.test(email)) {
        setAlert("Please enter a valid email address");
        return;
      }

      const user: UserLogin = {
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

      <Form className={classes.loginFormContainer}>
        {alert && <Alert variant="danger">{alert}</Alert>}
        <Form.Group
          className={classes.loginEmailContainer}
          controlId="formEmail"
        >
          <Form.Label
            className={
              alert && alert.includes("Email")
                ? classes.loginLabelError
                : classes.loginLabel
            }
          >
            Email address
          </Form.Label>
          <Form.Control
            className={
              alert && alert.includes("Email")
                ? classes.loginEmailError
                : classes.loginEmailnput
            }
            type="email"
            placeholder="Enter your email"
            ref={inputEmailRef}
          />
        </Form.Group>

        <Form.Group
          className={classes.loginPasswordContainer}
          controlId="formPassword"
        >
          <Form.Label
            className={
              alert && alert.includes("Password")
                ? classes.loginLabelError
                : classes.loginLabel
            }
          >
            Password
          </Form.Label>
          <Form.Control
            className={
              alert && alert.includes("Password")
                ? classes.loginPasswordError
                : classes.loginPasswordInput
            }
            type="password"
            placeholder="Enter your password"
            ref={inputPasswordRef}
          />
        </Form.Group>

        <Link to="/SignUp" className={classes.signupLink}>
          Don't have an account? Click here to sign up.
        </Link>

        <Button
          className={classes.fromSubmitButton}
          type="button"
          onClick={handleLogInSubmit}
        >
          Submit
        </Button>
      </Form>
    </div>
  );
};

export default Login;
