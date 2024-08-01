import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

import secureLocalStorage from "react-secure-storage";

import classes from "./NavBar.module.css";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const NavBar: React.FC = () => {
  const [token, setToken] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = secureLocalStorage.getItem("token") as string;
    setToken(storedToken);
  }, []);

  const handleSignOut = useCallback(() => {
    secureLocalStorage.clear();
    setToken(null);
    navigate("/");
  }, []);

  return (
    <Navbar expand="lg" className={classes.navbarContainer}>
      <Container>
        <Navbar.Brand className={classes.mainNavItem}>
          Flavour Vault
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
          <Nav.Link href="/" className={classes.navItem}>
              Home Page
            </Nav.Link>
            <Nav.Link href="/recipeupload" className={classes.navItem}>
              Upload Recipe
            </Nav.Link>
          </Nav>
          <Nav className="ml-auto">
            {token ? (
              <Nav.Link onClick={handleSignOut} className={classes.navItem}>
                Sign Out
              </Nav.Link>
            ) : (
              <Nav.Link href="/login" className={classes.navItem}>
                Sign In
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
