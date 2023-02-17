import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import axios from "axios";
import { motion } from "framer-motion";
import React, { Fragment, useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Modal from "react-bootstrap/Modal";
import { Bar } from "react-chartjs-2";
import { NavLink, useNavigate } from "react-router-dom";
import NavbarOperator from "../../components/NavbarUser";
import SidebarUser from "../../components/SidebarUser";
import dashboardRoutes from "./routes";
function ClienteInfo({ cliente }) {
  const [abertura, setAbertura] = React.useState(false);
  const [consumos, setConsumos] = useState([]);
  const [fechas, setFechas] = useState([]);
  var auxFechas = [];
  var auxConsumos = [];
  var respuesta;
  let meses = [
    "Ene",
    "Feb",
    "Mar",
    "Abr",
    "May",
    "Jun",
    "Jul",
    "Ago",
    "Sep",
    "Oct",
    "Nov",
    "Dic",
  ];

  const getConsuption = async () => {
    setAbertura(!abertura);
    if (!abertura) {
      await axios({
        method: "get",
        url: "http://127.0.0.1:8000/cliente/facturacion/" + cliente.cedula,
      })
        .then(function (response) {
          respuesta = response.data.clientInfo.invoices;
          respuesta = respuesta.slice(-12);
          respuesta.map((elemento) => {
            auxConsumos.push(elemento.consumo);
            let fecha = new Date(elemento.fechaPago);
            let mes = meses[fecha.getMonth()];
            auxFechas.push(mes);
          });
        })
        .catch((error) => {
          console.log(error.response.data);
        });
      setConsumos(auxConsumos);
      setFechas(auxFechas);
    }
  };

  const data = {
    labels: fechas,
    datasets: [
      {
        label: "Consumo",
        backgroundColor: "rgb(255, 165, 0)",
        borderColor: "black",
        borderWidth: 1,
        hoverBackgroundColor: "rgb(255, 165, 0)",
        hoverborderColor: "black",
        data: consumos,
        barThickness: 10,
      },
    ],
  };

  const opciones = {
    responsive: true,
    //maintainAspectRatio: false,
    scales: {
      yAxes: [
        {
          ticks: {
            fontSize: 10,
            beginAtZero: true,
          },
        },
      ],
    },
  };

  return (
    <Fragment>
      <TableRow
        sx={{
          "&:last-child td, &:last-child th": {
            border: 0,
          },
        }}
      >
        <TableCell>
          <Button
            variant="link"
            id="button-addon1"
            required
            aria-label="expand row"
            size="small"
            onClick={getConsuption}
            //onClick={searchHandler}
          >
            {abertura ? (
              <KeyboardArrowUpIcon color="warning" />
            ) : (
              <KeyboardArrowDownIcon color="warning" />
            )}
          </Button>
        </TableCell>
        <TableCell>{cliente.cedula}</TableCell>
        <TableCell>{cliente.nombre}</TableCell>
        <TableCell>{cliente.apellidos}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={abertura} timeout="auto" unmountOnExit>
            <Box className="clienteInfoOpen" sx={{ margin: 1 }}>
              <div>
                <Typography variant="h6" gutterBottom component="div">
                  Información
                </Typography>
                <Table size="small" aria-label="purchases">
                  <TableHead>
                    <TableRow>
                      <TableCell component="th" scope="row">
                        Fecha de nacimiento: {cliente.fechaNacimiento}{" "}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        Número de telefono: {cliente.telefono}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Correo electrónico: {cliente.email}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        Estado del cliente: {cliente.estado}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        style={{
                          justifyContent: "space-between",
                          display: "flex",
                        }}
                      >
                        Direccion:{" "}
                        <NavLink
                          to={"/Gerente/client-location/" + cliente.cedula}
                          style={{ textDecoration: "none" }}
                        >
                          <Button
                            variant="warning"
                            id="button-addon1"
                            style={{
                              margin: 0,
                              padding: 2,
                              marginLeft: 4,
                              paddingLeft: 4,
                              paddingRight: 4,
                            }}
                          >
                            <i
                              className="bi bi-geo-alt"
                              style={{ margin: 1, padding: 0, marginRight: 4 }}
                            ></i>{" "}
                            {cliente.clientInfo.direccion}
                          </Button>
                        </NavLink>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                </Table>
              </div>
              <div style={{ width: "60%" }}>
                <h5>Consumo del cliente</h5>
                <Bar options={opciones} data={data} />
              </div>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </Fragment>
  );
}

function ManagerConsumption() {
  const cedula = JSON.parse(localStorage.getItem("loggedUser")).cedula;
  const navigate = useNavigate();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(15);
  const [user, setUser] = useState(null);
  const [noEncontrado, setNoEncontrado] = useState(false);
  const [clientes, setClientes] = useState([]);
  const [show, setShow] = useState(true);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const [datosFiltrados, setDatosFiltrados] = useState([]);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  useEffect(() => {
    async function getClients() {
      await axios({
        method: "get",
        url: "http://127.0.0.1:8000/cliente/all/",
      })
        .then(function (response) {
          setClientes(response.data);
          setDatosFiltrados(response.data);
        })
        .catch((error) => {
          console.log(error.response.data);
        });
      setShow(false);
    }
    getClients();
  }, []);

  const [filtro, setFiltro] = useState("");

  const manejarCambioFiltro = (event) => {
    setFiltro(event.target.value);
    if (filtro == "") {
      setDatosFiltrados(clientes);
    } else {
      setDatosFiltrados(
        clientes.filter((cliente) =>
          cliente.cedula.toString().includes(event.target.value)
        )
      );
    }
    console.log(datosFiltrados);
  };

  return (
    <>
      <div className="wrapper">
        <SidebarUser routes={dashboardRoutes} />
        <div className="contentPage">
          <NavbarOperator />

          <div className="content">
            <div className="dash_status">
              {clientes.length !== 0 ? (
                <div className="dash_status_inferior">
                  <h1>Clientes</h1>
                  <motion.div
                    exit={{ opacity: 0, scaleX: 0.5 }}
                    animate={{ opacity: 1, scaleX: 1 }}
                    initial={{ opacity: 0, scaleX: 0.9 }}
                    className="containerForm"
                    style={{ marginTop: 10, marginBottom: 10 }}
                  >
                    <InputGroup size="sm" className="mb-3">
                      {
                        <Form.Control
                          className="form-control-sm"
                          type="text"
                          required
                          value={filtro}
                          onChange={manejarCambioFiltro}
                          placeholder="CC del cliente"
                        />
                      }
                      <Button
                        variant="warning"
                        id="button-addon1"
                        required
                        onClick={manejarCambioFiltro}
                        size="sm"
                      >
                        Borrar
                      </Button>
                    </InputGroup>
                  </motion.div>
                  <motion.div
                    exit={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    initial={{ opacity: 0, scale: 0.9 }}
                  >
                    <Paper
                      sx={{
                        maxWidth: 1150,
                        height: "75vh",
                        overflow: "auto",
                      }}
                    >
                      <TableContainer
                        sx={{
                          minWidth: 400,
                          height: "-webkit-calc(100% - 52px)",
                        }}
                      >
                        <Table stickyHeader aria-label="sticky table">
                          <TableHead>
                            <TableRow>
                              <TableCell>Ver más</TableCell>
                              <TableCell>Cedula</TableCell>
                              <TableCell>Nombres</TableCell>
                              <TableCell>Apellidos</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {datosFiltrados.map((cliente, index) => {
                              return (
                                <ClienteInfo cliente={cliente} key={index} />
                              );
                            })}
                          </TableBody>
                        </Table>
                      </TableContainer>
                      <TablePagination
                        rowsPerPageOptions={[10, 15, 25, 100]}
                        component="div"
                        count={clientes.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                      />
                    </Paper>
                  </motion.div>
                </div>
              ) : null}
            </div>
          </div>
          <Modal show={show} onHide={() => setShow(false)}>
            <div>
              <div className="plug">
                <div className="arrow-1"></div>
                <div className="plugPuntas">
                  <div className="rec1"></div>
                  <div className="rec2"></div>
                </div>
              </div>
            </div>
          </Modal>
        </div>
      </div>
    </>
  );
}

export default ManagerConsumption;
