import {
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import TextField from "@mui/material/TextField";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";
import axios from "axios";
import es from "date-fns/locale/es";
import "dayjs/locale/es";
import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Table from "react-bootstrap/Table";
import InvoicePdf from "../../components/InvoicePdf";
import NavbarOperator from "../../components/NavbarUser";
import SidebarUser from "../../components/SidebarUser";
import dashboardRoutes from "./routes";

function AdminCutoffDate() {
  //setear los hooks useState
  const today = new Date();
  const [infoVU, setIifoVU] = useState([]);
  const [search, setSearch] = useState("");
  const [value, setValue] = useState(Date());
  const [invoiceC, setInvoiceC] = useState([]);
  const [showCargando, setShowCargando] = useState(false);
  const [generar, setGenerar] = useState(false);
  const [factInfo, setFactInfo] = useState({
    fechaCorte: `${today.getFullYear()}-${
      today.getMonth() + 1
    }-${today.getDate()}`,
  });
  const [facturaParams, setFacturaParams] = useState({
    porcentajeMora: 0.02,
    valorUnitario: 803,
  });
  //traer datos
  const updateDate = (newValue) => {
    setValue(newValue);
    const [day, month, year] = newValue.$d.toLocaleDateString().split("/");

    setFactInfo({ ...factInfo, fechaCorte: `${year}-${month}-${day}` });
  };
  useEffect(() => {
    const showData = async () => {
      setShowCargando(true);
      await axios({
        method: "get",
        url: "http://localhost:8000/api/valorUnitario/",
      })
        .then((res) => {
          setShowCargando(false);
          setFacturaParams({
            ...res.data[0],
            porcentajeMora: res.data[0].porcentajeMora.toFixed(2),
          });
        })
        .catch((err) => setShowCargando(false));
    };

    showData();
  }, []);

  const generarFac = async () => {
    setShowCargando(true);
    await axios({
      method: "post",
      url: "http://localhost:8000/api/facturacion/generar",
      data: factInfo,
    })
      .then(async (res) => {
        setShowModal(true);
        setInvoiceC(res.data);
        setGenerar(true);
        setShowCargando(false);
      })
      .catch((err) => setShowCargando(false));
  };

  //búsqueda
  const searcher = (e) => {
    setSearch(e.target.value);
    console.log(e.target.value);
  };

  //filtrado
  const results = !search
    ? infoVU
    : infoVU.filter(
        (dato) =>
          dato.valorUnitario.toString().includes(search) ||
          infoVU.filter((dato) =>
            dato.porcentajeMora.toString().includes(search)
          )
      );

  const [showModal, setShowModal] = useState(false);
  //const [invoices, setInvoices] = useState([]);

  const Facturas = ({ clientes }) => {
    return (
      <div
        style={{
          border: "1px",
          padding: "1em",
          borderRadius: "10px",
          boxShadow: "2px 2px 5px gray",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",

          width: "98%",
        }}
      >
        <TableContainer style={{ userSelect: "none" }}>
          <Table>
            <TableHead>
              <TableRow className="bg-curso text-white">
                <TableCell>
                  <strong>Factura</strong>
                </TableCell>
                <TableCell>
                  <strong>Cliente</strong>
                </TableCell>
                <TableCell>
                  <strong>Fecha de corte</strong>
                </TableCell>
                <TableCell>
                  <strong>Valor factura </strong>
                </TableCell>
                <TableCell>
                  <strong>Estado de pago</strong>
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {clientes.map((cliente, key) => {
                return <InvoicePdf cliente={cliente} key={key} />;
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    );
  };
  return (
    <>
      <div className="wrapper">
        <SidebarUser routes={dashboardRoutes} />

        <div className="contentPage">
          <NavbarOperator />
          <div
            className="content"
            style={{ display: "flex", alignItems: "center" }}
          >
            <div
              className="containerForm"
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              <div style={{ display: "flex", justifyContent: "center" }}>
                <LocalizationProvider
                  dateAdapter={AdapterDayjs}
                  adapterLocale={es}
                >
                  <StaticDatePicker
                    displayStaticWrapperAs="desktop"
                    openTo="day"
                    disablePast
                    value={value}
                    onChange={updateDate}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </LocalizationProvider>
              </div>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "center",
                  maxWidth: "200px",
                  margin: "10px",
                }}
              >
                <Row
                  style={{
                    maxHeight: "170px",
                  }}
                >
                  <Form.Group as={Col} controlId="formGridName">
                    <Form.Label>Porcentaje de mora</Form.Label>
                    <Form.Control
                      type="text"
                      disabled
                      style={{
                        width: "200px",
                      }}
                      onChange={(e) =>
                        setFacturaParams({
                          ...facturaParams,
                          porcentajeMora: e.target.value,
                        })
                      }
                      value={facturaParams.porcentajeMora}
                      placeholder="Sara"
                    />
                  </Form.Group>
                  <Form.Group as={Col} controlId="formGridName">
                    <Form.Label>Valor unitario KWH</Form.Label>
                    <Form.Control
                      type="text"
                      disabled
                      style={{
                        width: "200px",
                      }}
                      onChange={(e) =>
                        setFacturaParams({
                          ...facturaParams,
                          valorUnitario: e.target.value,
                        })
                      }
                      value={facturaParams.valorUnitario}
                      placeholder="Sara"
                    />
                  </Form.Group>
                </Row>

                {generar ? (
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      justifyContent: "center",
                      width: "100%",
                      padding: "10px",
                      maxWidth: "280px",
                    }}
                  >
                    <Button
                      variant="warning"
                      style={{ maxHeight: "40px", margin: "5px" }}
                      onMouseEnter={(e) =>
                        (e.target.style.backgroundColor = "gray")
                      }
                      onMouseLeave={(e) =>
                        (e.target.style.backgroundColor = "orange")
                      }
                    >
                      Notificar clientes
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="warning"
                    onClick={generarFac}
                    style={{ maxHeight: "40px", margin: "5px" }}
                    onMouseEnter={(e) =>
                      (e.target.style.backgroundColor = "gray")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.backgroundColor = "orange")
                    }
                  >
                    Generar Facturas
                  </Button>
                )}
              </div>
            </div>
            <div>
              {showModal && (
                <div
                  style={{
                    backgroundColor: "rgba(0,0,0,0.5)",
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    userSelect: "none",
                  }}
                >
                  <div
                    style={{
                      backgroundColor: "white",
                      padding: 20,
                      borderRadius: 10,
                      userSelect: "none",
                    }}
                  >
                    <h2> Facturas </h2>
                    <Facturas clientes={invoiceC} />
                    <div
                      style={{
                        alignItems: "center",
                        justifyContent: "center",
                        display: "flex",
                        userSelect: "none",
                      }}
                    >
                      <Button
                        style={{
                          border: "none",
                          backgroundColor: "orange",
                          marginTop: "1em",
                          userSelect: "none",
                        }}
                        onMouseEnter={(e) =>
                          (e.target.style.backgroundColor = "gray")
                        }
                        onMouseLeave={(e) =>
                          (e.target.style.backgroundColor = "orange")
                        }
                        onClick={() => setShowModal(false)}
                      >
                        Cerrar
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <Modal show={showCargando} centered>
          <div className="plug">
            <div className="arrow-1"></div>
            <div className="plugPuntas">
              <div className="rec1"></div>
              <div className="rec2"></div>
            </div>
          </div>
        </Modal>
      </div>
    </>
  );
}

export default AdminCutoffDate;
