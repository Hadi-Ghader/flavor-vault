import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";
import { jwtDecode } from "jwt-decode";

import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

import { IoHomeSharp } from "react-icons/io5";
import { FaStar } from "react-icons/fa";
import { FaUpload } from "react-icons/fa6";

import { UserToken } from "../../models/UserToken";
import classes from "./NavBar.module.css";

const NavBar: React.FC = () => {
  const [token, setToken] = useState<string | null>(null);
  const userName = useRef<string>();

  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = secureLocalStorage.getItem("token") as string;
    if (typeof storedToken === "string") {
      setToken(storedToken);
      const decodedToken = jwtDecode<UserToken>(storedToken);
      userName.current = decodedToken.unique_name;
    } else {
      setToken(null);
    }
  }, []);

  const handleSignOut = useCallback(() => {
    secureLocalStorage.clear();
    setToken(null);
    navigate("/login");
  }, [navigate]);

  return (
    <Navbar expand="lg" className={classes.navbarContainer}>
      <Container>
        <Navbar.Brand className={classes.mainNavItem}>
          <Nav.Link href="/" className={classes.navItem}>
            Flavour Vault
          </Nav.Link>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" className="me-3" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/" className={classes.navItem}>
              <span className={classes.navText}>Home Page</span>
              <IoHomeSharp />
            </Nav.Link>
            <Nav.Link href="/favorites" className={classes.navItem}>
              <span className={classes.navText}>Your Favorites</span>
              <FaStar />
            </Nav.Link>
            <Nav.Link href="/recipeupload" className={classes.navItem}>
              <span className={classes.navText}>Upload Recipe</span>
              <FaUpload />
            </Nav.Link>
          </Nav>
          <Nav className="ml-auto">
            {userName.current && (
              <Nav.Link href="/" className={classes.navItem}>
                Welcome: {userName.current}
              </Nav.Link>
            )}
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
