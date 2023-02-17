import React, { useState } from "react";

import { motion } from "framer-motion";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import NavbarOperator from "../../components/NavbarUser";
import SidebarUser from "../../components/SidebarUser";
import dashboardRoutes, { pageTransition } from "./routes";

import axios from "axios";

function OperatorNewPayment() {
  const [invoices, setInvoices] = useState([]);
  const [searchId, setSearchId] = useState("");
  const [user, setUser] = useState(null);
  const [show, setShow] = useState(false);
  const [noEncontrado, setNoEncontrado] = useState(false);
  const [facturaCliente, setFacturaCliente] = useState(null);
  const [newPago, setNewPago] = useState(null);
  const searchHandler = async (e) => {
    setShow(true);

    await axios({
      method: "get",
      url: "http://127.0.0.1:8000/api/usuario/" + searchId + "/",
    })
      .then(async function (response) {
        await axios({
          method: "get",
          url: "http://127.0.0.1:8000/cliente/facturacion/" + searchId,
        }).then(function (responseFac) {
          let facts = responseFac.data.clientInfo.invoices.sort(
            (a, b) => b.id - a.id
          );
          facts = facts.filter((fact) => fact.estadoPago != "Pagado");
          setInvoices(facts);
          setFacturaCliente(facts[0]);
          setShow(false);
          setUser(response.data);
        });
      })
      .catch((error) => {
        setNoEncontrado(true);
        setSearchId("");
        setShow(false);
      });
  };

  const submitHandler = async (e) => {
    setShow(true);
    e.preventDefault();
    const pago = {
      numeroFactura: facturaCliente.id,
      monto: facturaCliente.costoTotal,
    };
    await axios({
      method: "post",
      url: "http://127.0.0.1:8000/api/pago/",
      data: pago,
    }).then(async function (responseUser) {
      setNewPago(responseUser.data);
    });
  };
  const printPagoInfo = () => {
    var divContents = document.getElementById("pagoInfo").innerHTML;
    var originalContents = document.body.innerHTML;
    document.body.innerHTML = divContents;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload();
  };

  return (
    <>
      <div className="wrapper">
        <SidebarUser routes={dashboardRoutes} />

        <div className="contentPage">
          <NavbarOperator />
          <motion.div
            variants={pageTransition}
            exit="out"
            animate="in"
            initial="out"
            className="content"
          >
            <div className="containerForms">
              <div className="containerForm">
                <InputGroup className="mb-3">
                  <Form.Control
                    type="text"
                    placeholder="CC del cliente"
                    value={searchId}
                    onChange={(e) => {
                      setSearchId(e.target.value);
                    }}
                  />
                  <Button
                    variant="warning"
                    id="button-addon1"
                    onClick={searchHandler}
                  >
                    Buscar
                  </Button>
                </InputGroup>
              </div>
              {user ? (
                <div className="containerForm">
                  <Form onSubmit={submitHandler}>
                    <Row className="mb-3">
                      <Form.Group as={Col} controlId="formGridName">
                        <Form.Label>Nombres</Form.Label>
                        <Form.Control
                          type="text"
                          disabled
                          value={user.nombre}
                          placeholder="Sara"
                        />
                      </Form.Group>
                      <Form.Group as={Col} controlId="formGridLastName">
                        <Form.Label>Apellidos</Form.Label>
                        <Form.Control
                          type="text"
                          disabled
                          value={user.apellidos}
                          placeholder="Smith"
                        />
                      </Form.Group>
                    </Row>

                    {invoices.length !== 0 ? (
                      <>
                        {" "}
                        <Row className="mb-3">
                          <Form.Group as={Col} controlId="formGridName">
                            <Form.Label>Numero de factura</Form.Label>

                            <select
                              className="form-select"
                              value={facturaCliente.id}
                              onChange={(e) => {
                                const new_fact = invoices.find((fact) => {
                                  return fact.id === Number(e.target.value);
                                });
                                setFacturaCliente(new_fact);
                              }}
                              required
                              id="inputGroupSelect01"
                            >
                              {invoices.map((prop, key) => {
                                return (
                                  <option value={prop.id} key={key}>
                                    {prop.id}
                                  </option>
                                );
                              })}
                            </select>
                          </Form.Group>
                          <Form.Group className={"col-sm-6"}>
                            <Form.Label>Estado</Form.Label>
                            <Form.Control
                              type="text"
                              value={facturaCliente.estadoPago}
                              disabled
                            />
                          </Form.Group>
                        </Row>
                        {facturaCliente ? (
                          <Row className="mb-3">
                            <Form.Group className={"col-sm-6"}>
                              <Form.Label>Fecha limite de pago</Form.Label>
                              <Form.Control
                                type="date"
                                value={facturaCliente.fechaVencimiento}
                                disabled
                              />
                            </Form.Group>
                            <Form.Group
                              as={Col}
                              controlId="formGridMontoDePago"
                            >
                              <Form.Label>Monto a pagar</Form.Label>
                              <Form.Control
                                type="number"
                                value={facturaCliente.costoTotal}
                                disabled
                              />
                            </Form.Group>
                          </Row>
                        ) : (
                          <></>
                        )}
                        <div className="buttonSubmit">
                          <Button variant="warning" type="submit">
                            Registrar pago
                          </Button>
                        </div>
                      </>
                    ) : (
                      <h2>No hay facturas por pagar</h2>
                    )}
                  </Form>
                </div>
              ) : (
                <div>
                  {noEncontrado ? (
                    <h2> Identificacion no encontrada </h2>
                  ) : (
                    <></>
                  )}
                </div>
              )}
              <Modal show={show} onHide={() => setShow(false)}>
                {newPago ? (
                  <div>
                    <Modal.Header>
                      <Modal.Title>Nuevo Pago registrado</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <div className="newClient" id="pagoInfo">
                        <div className="top_section">
                          <img
                            src={require("../../media/imago.png")}
                            width={280}
                            alt="imago"
                          />
                        </div>
                        <h2>
                          Se registro un pago por {newPago.monto} el{" "}
                          {newPago.fecha} correspondiente a la factura numero:{" "}
                          {newPago.numeroFactura}
                        </h2>
                        <h2></h2>
                      </div>
                    </Modal.Body>
                    <Modal.Footer>
                      <Button
                        variant="secondary"
                        onClick={() => {
                          setShow(false);
                          searchHandler();
                          setNewPago(null);
                        }}
                      >
                        Cerrar
                      </Button>
                      <Button variant="primary" onClick={printPagoInfo}>
                        Imprimir recibo
                      </Button>
                    </Modal.Footer>
                  </div>
                ) : (
                  <div>
                    <div className="plug">
                      <div className="arrow-1"></div>
                      <div className="plugPuntas">
                        <div className="rec1"></div>
                        <div className="rec2"></div>
                      </div>
                    </div>
                  </div>
                )}
              </Modal>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}

export default OperatorNewPayment;
