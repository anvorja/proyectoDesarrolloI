import React, { useEffect, useState } from "react";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import NavbarOperator from "../../components/NavbarUser";
import SidebarUser from "../../components/SidebarUser";
import dashboardRoutes from "./routes";

import ContentPasteSearch from "@mui/icons-material/ContentPasteSearch";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import axios from "axios";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import ProgressBar from "react-bootstrap/ProgressBar";
import Modal from "../../components/Modal";
import "../../styles/clientBar.css";

import {
  Avatar,
  Box,
  Card,
  CardContent,
  Grid,
  IconButton,
  Typography
} from "@mui/material";

import {
  BarController,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Tooltip
} from "chart.js";
import { Chart } from "react-chartjs-2";

ChartJS.register(
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  LineController,
  BarController
);

function ClientHome() {
  const idCard = JSON.parse(localStorage.getItem("loggedUser")).cedula;
  const [page, setPage] = React.useState(0);
  const [sinPagar, setSinPagar] = React.useState(0);
  const [enMora, setEnMora] = React.useState(0);
  const [invoices, setInvoices] = useState([]);
  const [estado, setEstado] = useState(null);
  const [rowsPerPage, setRowsPerPage] = React.useState(15);

  const [lastInvoice, setLastInvoice] = useState({});
  const [row, setRow] = useState([]);
  const [colm, setColm] = useState([]);

  const [show, setShow] = useState(true);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  useEffect(() => {
    if (invoices) {
      const lastInv = invoices[invoices.length];
      setLastInvoice(lastInv);

      const last5Invoices = invoices
        .reverse()
        .slice(invoices.length - 6, invoices.length);

      const extractMonths = [...last5Invoices].map((aInvoice) => {
        return dayjs(aInvoice.fechaVencimiento).format("MMM");
      });

      const extractConsumes = [...last5Invoices].map((aInvoice) => {
        return aInvoice.consumo;
      });
      setInvoices(invoices.reverse());
      setRow(extractMonths);
      setColm(extractConsumes);
    }
  }, [invoices]);

  const options = {
    maintainAspectRatio: false,
    responsive: true,

    plugins: {
      legend: {
        display: false,
      },
      title: {
        text: "Consumo mensual",
        color: "rgb(74,70,74)",
        display: true,
      },
    },

    scales: {
      y: {
        ticks: {
          color: "rgb(97,93,97)",
        },
      },
      x: {
        ticks: {
          color: "rgb(97,93,97)",
        },
      },
    },
  };

  const GraphBar = {
    labels: row,
    datasets: [
      {
        type: "line",
        borderColor: "rgb(255, 99, 132)",
        borderWidth: 2,
        fill: false,
        data: colm,
      },
      {
        type: "bar",
        label: "Consumo (kWh)",
        backgroundColor: "rgb(75, 192, 192)",
        data: colm,
        borderColor: "white",
        borderWidth: 2,
      },
    ],
  };

  const [modalState1, setModalState1] = useState(false);

  useEffect(() => {
    async function getFacts() {
      await axios({
        method: "get",
        url: "http://127.0.0.1:8000/cliente/facturacion/" + idCard,
      }).then(function (responseFac) {
        const suspencion = responseFac.data.clientInfo.suspendido;
        if (suspencion) {
          setEstado("Suspendido");
        } else {
          setEstado("Activo");
        }
        const facts = responseFac.data.clientInfo.invoices.sort(
          (a, b) => b.id - a.id
        );
        setInvoices(facts);
        const noPagadas = facts.filter(
          (filter) => filter.estadoPago !== "Pagado"
        );
        setSinPagar(noPagadas.length);
        setEnMora(
          noPagadas.filter((filter) => filter.estadoPago === "En mora").length
        );
      });
      setShow(false);
    }
    getFacts();
  }, []);

  return (
    <>
      <div className="wrapper">
        <SidebarUser routes={dashboardRoutes} />

        <div className="contentPage">
          <NavbarOperator />

          <div className="content">
            <div className="dash_status">
              <div className="dash_status_superior">
                {estado ? (
                  <motion.div
                    exit={{ opacity: 0, x: "50%" }}
                    animate={{ opacity: 1, x: 0 }}
                    initial={{ opacity: 0, x: "50%" }}
                    style={{ y: 8 }}
                  >
                    <Card>
                      <CardContent>
                        <Grid
                          container
                          responsive={true}
                          spacing={3}
                          sx={{
                            justifyContent: "space-between",
                            overflow: "auto",
                          }}
                        >
                          <Grid item>
                            <Typography
                              color="textSecondary"
                              gutterBottom
                              variant="h6"
                            >
                              Estado:
                            </Typography>
                            <Typography color="textPrimary" variant="h3">
                              {estado}
                            </Typography>
                          </Grid>
                          {estado === "Activo" ? (
                            <Grid item>
                              <Avatar
                                sx={{
                                  backgroundColor: "success.main",
                                  height: 65,
                                  width: 65,
                                }}
                              >
                                <i className="bi bi-check2-circle"></i>
                              </Avatar>
                            </Grid>
                          ) : (
                            <Grid id="iconos-status" item>
                              <Avatar
                                sx={{
                                  backgroundColor: "error.main",
                                  height: 65,
                                  width: 65,
                                }}
                              >
                                <i className="bi bi-dash-circle"></i>
                              </Avatar>
                            </Grid>
                          )}
                        </Grid>
                        <Box sx={{ pt: 3 }}>
                          Facturas sin Pagar: {sinPagar}
                          {estado === "Activo" ? (
                            <ProgressBar
                              variant="warning"
                              now={100 - (enMora / 2) * 100}
                            />
                          ) : (
                            <Typography
                              color="textSecondary"
                              paragraph
                              variant="caption"
                              align="center"
                            >
                              Paga tus facturas para ser reactivado
                            </Typography>
                          )}
                        </Box>
                      </CardContent>
                    </Card>
                  </motion.div>
                ) : (
                  <></>
                )}

                {colm.length !== 0 ? (
                  <motion.div
                    style={{ y: 10 }}
                    responsive={true}
                    exit={{ opacity: 0, x: "-50%" }}
                    animate={{ opacity: 1, x: 0 }}
                    initial={{ opacity: 0, x: "-50%" }}
                  >
                    <Card>
                      <Box item xs={6} marginLeft={2}>
                        <IconButton
                          onClick={() => setModalState1(!modalState1)}
                        >
                          <ContentPasteSearch />
                        </IconButton>
                      </Box>

                      <CardContent className="myCard">
                        <Chart type="bar" options={options} data={GraphBar} />
                      </CardContent>
                    </Card>
                  </motion.div>
                ) : (
                  <></>
                )}
              </div>

              {invoices.length !== 0 ? (
                <motion.div
                  style={{ y: 15 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  initial={{ opacity: 0, scale: 0.5 }}
                  className="dash_status_inferior"
                >
                  <h1>Facturas</h1>
                  <Paper
                    sx={{
                      maxWidth: 1150,
                      height: "80vh",
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
                            <TableCell>Numero de factura</TableCell>
                            <TableCell>Fecha de corte</TableCell>
                            <TableCell>Valor total</TableCell>
                            <TableCell>Estado Pago</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {invoices.map((invoice, key) => {
                            return (
                              <TableRow
                                key={invoice.id}
                                sx={{
                                  "&:last-child td, &:last-child th": {
                                    border: 0,
                                  },
                                }}
                              >
                                <TableCell>{invoice.id}</TableCell>
                                <TableCell>{invoice.fechaPago}</TableCell>

                                <TableCell>{invoice.consumo}</TableCell>
                                <TableCell>
                                  {(() => {
                                    switch (invoice.estadoPago) {
                                      case "Pagado":
                                        return (
                                          <Alert
                                            key={"success"}
                                            variant={"success"}
                                          >
                                            {invoice.estadoPago}
                                          </Alert>
                                        );
                                      case "Sin pagar":
                                        return (
                                          <Alert variant={"warning"}>
                                            {invoice.estadoPago}
                                            <Button
                                              variant="warning"
                                              href={
                                                "/Cliente/new-payment/" +
                                                invoice.id
                                              }
                                            >
                                              Pagar
                                            </Button>
                                          </Alert>
                                        );
                                      case "En mora":
                                        return (
                                          <Alert variant={"danger"}>
                                            {invoice.estadoPago}
                                            <Button
                                              variant="danger"
                                              href={
                                                "/Cliente/new-payment/" +
                                                invoice.id
                                              }
                                            >
                                              Pagar
                                            </Button>
                                          </Alert>
                                        );
                                    }
                                  })()}
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </TableContainer>
                    <TablePagination
                      rowsPerPageOptions={[10, 15, 25, 100]}
                      component="div"
                      count={invoices.length}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                  </Paper>
                </motion.div>
              ) : (
                <></>
              )}
            </div>
            <Modal
              estado={modalState1}
              cambiarEstado={setModalState1}
              titulo={"Historial de Consumo (kWh)"}
            >
              <Paper
                sx={{
                  maxWidth: 1150,
                  height: "80vh",
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
                      <TableRow style={{ backgroundColor: "#ffc000" }}>
                        <TableCell>Fecha</TableCell>
                        <TableCell>Consumo</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {invoices.map((invoice, key) => {
                        return (
                          <TableRow
                            key={invoice.id}
                            sx={{
                              "&:last-child td, &:last-child th": {
                                border: 0,
                              },
                            }}
                          >
                            <TableCell>{invoice.fechaPago}</TableCell>
                            <TableCell>{invoice.consumo}</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Modal>
          </div>
        </div>
      </div>
    </>
  );
}

export default ClientHome;
