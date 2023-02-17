import React from "react";
import "../styles/home.css";
import { Navbar } from "react-bootstrap";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import Container from "react-bootstrap/Container";
import { motion } from "framer-motion";
function About() {
  const devs = [
    {
      nombre: "Juan José Viáfara",
      codigo: "2040751",
      correo: "viafara.juan@correounivalle.edu.co",
    },
    {
      nombre: "William Velasco Muñoz",
      codigo: "2042577",
      correo: "william.velasco@correounivalle.edu.co",
    },
    {
      nombre: "Carlos Andrés Borja",
      codigo: "2040507",
      correo: "borja.carlos@correounivalle.edu.co",
    },
    {
      nombre: "Deisy Melo",
      codigo: "2041790",
      correo: "deisy.melo@correounivalle.edu.co",
    },
    {
      nombre: "Natalia Riaños Horta",
      codigo: "2042568",
      correo: "rianos.natalia@correounivalle.edu.co",
    },
    {
      nombre: "Nicolás Fernando Huertas",
      codigo: "2180569",
      correo: "nicolas.huertas@correounivalle.edu.co",
    },
    {
      nombre: "Juan Esteban Mazuera",
      codigo: "2043008",
      correo: "juan.yunda@correounivalle.edu.co",
    },
    {
      nombre: "Sheilly Daylin Ortega",
      codigo: "2040051",
      correo: "sheilly.ortega@correounivalle.edu.co",
    },
    {
      nombre: "Andrés Camargo",
      codigo: "1944140",
      correo: "andres.camargo@correounivalle.edu.co",
    },
  ];
  const container = {
    hidden: { opacity: 1, scale: 0.2 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { y: 30, opacity: 0 },
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
      <div className="about_content">
        <motion.div
          className="container_dev"
          variants={container}
          initial="hidden"
          animate="visible"
          exit={"hidden"}
        >
          <h1>Proyecto final - Desarrollo de Software 1</h1>
          {devs.map((dev, key) => (
            <motion.div className="item_dev" key={key} variants={item}>
              {dev.nombre} {dev.codigo} {dev.correo}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

export default About;