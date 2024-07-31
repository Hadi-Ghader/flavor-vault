import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";

import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
const NoTokenComponent: React.FC  = () => {
const navigate = useNavigate();

  const redirectToSignIn = useCallback(() => {
    navigate("/login");
  }, [navigate]);

  return (
    <Alert variant="dark">
      <Alert.Heading>Attention!</Alert.Heading>
      <p>You need to sign in to your account to be able to access this page.</p>
      <hr />
      <Button onClick={redirectToSignIn} variant="outline-dark">
        Go to sign in
      </Button>
    </Alert>
  );
};

export default NoTokenComponent;
