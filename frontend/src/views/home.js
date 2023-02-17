import { motion } from "framer-motion";
import React from "react";
import { Navbar } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import "../styles/home.css";
const Home = () => {
  const container = {
    hidden: { opacity: 1, y: "5%" },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.3,
      },
    },
  };

  const item = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };
  return (
    <div className="home_container">
      <div className="navbarLogin">
        <Navbar collapseOnSelect expand="lg" bg="transparent" variant="light">
          <Container>
            <Navbar.Brand href="/">
              <img
                src={require("../media/logInResources/logo1.png")}
                width={70}
                height={70}
                alt={" "}
              />{" "}
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link href="/about">sobre EnergyApp</Nav.Link>
                <Nav.Link href="/Cliente">Clientes</Nav.Link>
                <NavDropdown
                  title="Funcionarios"
                  id="basic-nav-dropdown"
                  className="dropNav"
                >
                  <div className="dropdownMenu">
                    <Nav.Link href="/Operador">Operadores</Nav.Link>
                    <Nav.Link href="/Administrador">Administradores</Nav.Link>
                    <Nav.Link href="/Gerente">Gerentes</Nav.Link>
                  </div>
                </NavDropdown>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </div>
      <div className="home_content">
        <motion.div
          className="home_intro"
          variants={container}
          initial="hidden"
          animate="visible"
        >
          <motion.h1 className="home_title" variants={item}>EnergyApp</motion.h1>
          <motion.h6 className="home_subtitle" variants={item}>2023 | un servicio de Energy X</motion.h6>
          <motion.div
            className="btn_home"
            style={{ maxWidth: "150px", height: "50px" }}
            variants={item}
          >
            <Button variant="outline-warning" href="/login" size="lg">
              Log In
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;
