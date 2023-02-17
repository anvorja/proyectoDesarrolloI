import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import { NavLink } from "react-router-dom";
import NavbarOperator from "../../components/NavbarUser";
import SidebarUser from "../../components/SidebarUser";
import dashboardRoutes from "./routes";

import Form from "react-bootstrap/Form";

import {
  Grid,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Paper from "@mui/material/Paper";
import axios from "axios";
import { motion } from "framer-motion";
import { Button } from "react-bootstrap";
import { default as InputGroup } from "react-bootstrap/InputGroup";
export const logoutHandler = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("loggedUser");
  clearInterval(localStorage.getItem("intervalId"));
  localStorage.removeItem("intervalId");
};

function AdminSearchUser() {
  //setear los hooks useState
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  //traer datos

  const URL = "http://127.0.0.1:8000/api/usuario/";

  const showData = async () => {
    await axios({
      method: "get",
      url: "http://127.0.0.1:8000/api/usuario/",
    }).then((response) => {
      console.log(response.data);
      setUsers(response.data);
    });
  };

  useEffect(() => {
    showData();
  }, []);

  //búsqueda
  const searcher = (e) => {
    setSearch(e.target.value);
    console.log(e.target.value);
  };

  //filtrado
  const results = !search
    ? users
    : users.filter(
        (dato) =>
          dato.cedula.toString().includes(search) ||
          dato.nombre.toLowerCase().includes(search.toLocaleLowerCase()) ||
          dato.apellidos.toLowerCase().includes(search.toLocaleLowerCase())
      );

  return (
    <>
      <div className="wrapper">
        <SidebarUser routes={dashboardRoutes} />

        <div className="contentPage">
          <NavbarOperator />
          <div className="content" style={{ userSelect: "none" }}>
            <div className="cointainer-fluid" style={{ width: "100%" }}>
              <h1 className="text-left">Usuarios</h1>

              <motion.div
                exit={{ opacity: 0, scaleX: 0.5 }}
                animate={{ opacity: 1, scaleX: 1 }}
                initial={{ opacity: 0, scaleX: 0.9 }}
                className="containerForm"
                style={{ marginTop: 10, marginBottom: 10 }}
              >
                <InputGroup className="mb-3">
                  <Form.Control
                    type="text"
                    placeholder="CC o nombre del usuario"
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                    }}
                  />
                </InputGroup>
              </motion.div>
              <motion.div style={{ userSelect: "none" }}>
                <Paper
                  sx={{
                    maxWidth: 1150,
                    height: "70vh",
                    overflow: "auto",
                  }}
                >
                  <TableContainer style={{ userSelect: "none" }}>
                    <Table>
                      <TableHead>
                        <TableRow className="bg-curso text-white">
                          <TableCell></TableCell>
                          <TableCell></TableCell>
                          <TableCell>
                            <strong>NOMBRE</strong>
                          </TableCell>
                          <TableCell></TableCell>
                          <TableCell>
                            <strong>APELLIDO</strong>
                          </TableCell>
                          <TableCell></TableCell>
                          <TableCell>
                            <strong>CÉDULA</strong>
                          </TableCell>
                          <TableCell></TableCell>
                          <TableCell>
                            <strong>CORREO</strong>
                          </TableCell>
                          <TableCell></TableCell>
                          <TableCell>
                            <strong>ROL</strong>
                          </TableCell>
                          <TableCell></TableCell>
                          <TableCell>
                            <strong>ESTADO</strong>
                          </TableCell>
                          <TableCell></TableCell>
                          <TableCell></TableCell>
                          <TableCell></TableCell>
                        </TableRow>
                      </TableHead>

                      <TableBody>
                        {results.map((user) => {
                          return (
                            <TableRow>
                              <TableCell>
                                {" "}
                                <TableCell class="custommy-cell-width">
                                  {" "}
                                  {user.imageUrl ? (
                                    <Grid>
                                      <Avatar
                                        alt={user.nombre}
                                        src={user.imageUrl}
                                        referrerPolicy="no-referrer"
                                        sx={{ width: 70, height: 70 }}
                                      />
                                    </Grid>
                                  ) : (
                                    <Grid>
                                      <Avatar
                                        alt={user.nombre}
                                        src={user.imageUrl}
                                        referrerPolicy="no-referrer"
                                        sx={{ width: 70, height: 70 }}
                                      />
                                    </Grid>
                                  )}
                                </TableCell>
                              </TableCell>
                              <TableCell></TableCell>
                              <TableCell className="custommy-cell-alignment">
                                {user.nombre.toUpperCase()}
                              </TableCell>
                              <TableCell></TableCell>
                              <TableCell className="custommy-cell-alignment">
                                {user.apellidos.toUpperCase()}
                              </TableCell>
                              <TableCell></TableCell>
                              <TableCell className="custommy-cell-alignment">
                                {user.cedula}
                              </TableCell>
                              <TableCell></TableCell>
                              <TableCell className="custommy-cell-alignment">
                                {user.email}
                              </TableCell>
                              <TableCell></TableCell>
                              <TableCell className="custommy-cell-alignment">
                                {user.rol}
                              </TableCell>
                              <TableCell></TableCell>
                              <TableCell className="custommy-cell-alignment">
                                {user.estado}
                              </TableCell>
                              <TableCell></TableCell>
                              <TableCell className="custommy-cell-alignment"></TableCell>
                              <TableCell class="custommy-cell-width">
                                <Grid>
                                  <NavLink
                                    to={
                                      "/Administrador/update-user/" +
                                      user.cedula
                                    }
                                    className="link_nav"
                                    style={{ textDecoration: "none" }}
                                  >
                                    <Button
                                      variant="link"
                                      style={{ textDecoration: "none" }}
                                    >
                                      <div className="icon">
                                        <i className="bi bi-gear"></i>
                                      </div>
                                    </Button>
                                  </NavLink>
                                </Grid>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </motion.div>

              <motion.div style={{ userSelect: "none" }}>
                <div>
                  <InputGroup className="mb-3"></InputGroup>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminSearchUser;
