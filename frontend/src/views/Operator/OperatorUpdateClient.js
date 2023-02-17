import React, { useState } from "react";
import SidebarUser from "../../components/SidebarUser";
import dashboardRoutes, { pageTransition } from "./routes";
import NavbarOperator from "../../components/NavbarUser";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Modal from "react-bootstrap/Modal";
import { Dayjs } from "dayjs";
import TextField from "@mui/material/TextField";
import InputGroup from "react-bootstrap/InputGroup";
import axios from "axios";
import { motion } from "framer-motion";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { es } from "date-fns/locale";
function OperatorUpdateClient() {
  const [value, setValue] = useState(Dayjs);
  const [location, setLocation] = useState(null);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const [user, setUser] = useState(null);
  const [noEncontrado, setNoEncontrado] = useState(false);
  const [newUser, setNewUser] = useState(null);
  const [client, setClient] = useState(null);

  const printUserInfo = () => {
    var divContents = document.getElementById("userInfo").innerHTML;
    var originalContents = document.body.innerHTML;
    document.body.innerHTML = divContents;
    window.print();
    document.body.innerHTML = originalContents;
  };

  const updateDate = (newValue) => {
    setValue(newValue);
    const [day, month, year] = newValue.toLocaleDateString().split("/");
    setUser({ ...user, fechaNacimiento: `${year}-${month}-${day}` });
  };

  const submitHandler = async (e) => {
    setShow(true);
    e.preventDefault();
    await axios({
      method: "post", // <----
      url: "http://127.0.0.1:8000/api/usuario/modificar/"+ searchId+"/",
      data: user,
    }).then(async function (responseUser) {
      await axios({
        method: "put", // <----
        url: "http://127.0.0.1:8000/api/cliente/" + searchId + "/",
        data: client,
      }).then(function (responseCliente) {
        setNewUser(responseUser.data);
      });
    });
  };

  const [searchId, setSearchId] = useState("");

  const searchHandler = async (e) => {
    setShow(true);
    e.preventDefault();
    await axios({
      method: "get",
      url: "http://127.0.0.1:8000/api/usuario/" + searchId + "/",
    })
      .then(async function (responseUser) {
        setUser({ ...responseUser.data, password: "" });

        const { fechaNacimiento } = responseUser.data;
        var date = new Date(fechaNacimiento);
        setValue(date.setDate(date.getDate() + 1));
        await axios({
          method: "get",
          url: "http://127.0.0.1:8000/api/cliente/" + searchId + "/",
        }).then(function (response) {
          const [direccion, ciudad, departamento] =
            response.data.direccion.split(", ");
          setLocation({
            ciudad: ciudad,
            departamento: departamento,
            direccion: direccion,
          });
          setClient({
            ...response.data,
            direccion: `${direccion}, ${ciudad}, ${departamento}`,
          });
          setShow(false);
        }).catch((error) => {
          setNoEncontrado(true);
          setSearchId("");
          setShow(false);
        });

      })
      .catch((error) => {
        setNoEncontrado(true);
        setSearchId("");
        setShow(false);
      });
  };

  return (
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
                    <Form.Group as={Col} controlId="formGridLastName">
                      <Form.Label>Nombres</Form.Label>
                      <Form.Control
                        type="text"
                        required
                        onChange={(e) =>
                          setUser({ ...user, nombre: e.target.value })
                        }
                        value={user.nombre}
                        placeholder=""
                      />
                    </Form.Group>

                    <Form.Group as={Col} controlId="formGridName">
                      <Form.Label>Apellidos</Form.Label>
                      <Form.Control
                        type="text"
                        required
                        onChange={(e) =>
                          setUser({ ...user, apellidos: e.target.value })
                        }
                        value={user.apellidos}
                        placeholder=""
                      />
                    </Form.Group>
                  </Row>

                  <Row className="mb-3">
                    <Form.Group className={"col-sm-6"}>
                      <Form.Label>Fecha de Nacimiento</Form.Label>
                      <LocalizationProvider
                        dateAdapter={AdapterDateFns}
                        adapterLocale={es}
                      >
                        <DatePicker
                          value={value}
                          views={["year", "month", "day"]}
                          required
                          disableFuture
                          onChange={updateDate}
                          renderInput={(params) => (
                            <TextField
                              margin="dense"
                              fullWidth
                              color="warning"
                              style={{ margin: 0, padding: 0 }}
                              size="small"
                              InputLabelProps={{
                                shrink: true,
                                className: "textfield__label",
                              }}
                              {...params}
                            />
                          )}
                        />
                      </LocalizationProvider>
                    </Form.Group>
                    <Form.Group as={Col} controlId="formGridEmail">
                      <Form.Label>Correo</Form.Label>
                      <Form.Control
                        value={user.email}
                        onChange={(e) =>
                          setUser({ ...user, email: e.target.value })
                        }
                        required
                        type="email"
                        placeholder=""
                        autoComplete="username"
                      />
                    </Form.Group>
                  </Row>

                  <Row className="mb-3">
                    <Form.Group as={Col} controlId="formGridCedula">
                      <Form.Label>Numero de Cedula</Form.Label>
                      <Form.Control
                        type="number"
                        value={user.cedula}
                        disabled
                        onChange={(e) => {
                          setClient({ ...client, cedula: e.target.value });
                        }}
                        placeholder=""
                      />
                    </Form.Group>

                    <Form.Group className={"col-sm-6"} controlId="formGrid">
                      <Form.Label>Telefono</Form.Label>
                      <Form.Control
                        type="number"
                        value={user.telefono}
                        required
                        onChange={(e) =>
                          setUser({ ...user, telefono: e.target.value })
                        }
                        placeholder=""
                        autoComplete="tel"
                      />
                    </Form.Group>
                  </Row>

                  <Row className="mb-3">
                    <Form.Group as={Col} controlId="formGridPassword">
                      <Form.Label>Contraseña</Form.Label>
                      <Form.Control
                        type="password"
                        value={user.password}
                        onChange={(e) =>
                          setUser({ ...user, password: e.target.value })
                        }
                        disabled
                        placeholder=""
                        autoComplete="new-password"
                      />
                    </Form.Group>
                    <Form.Group className={"col-sm-6"}>
                      <Form.Label>Estado</Form.Label>

                      <select
                        className="form-select"
                        value={user.estado}
                        onChange={(e) =>
                          setUser({ ...user, estado: e.target.value })
                        }
                        id="inputGroupSelect02"
                      >
                        <option value="Activo">Activo</option>
                        <option value="Inactivo">Inactivo</option>
                      </select>
                    </Form.Group>
                  </Row>

                  {client ? (
                    <div>
                      <Row>
                        <Form.Group as={Col} controlId="formGridCity">
                          <Form.Label>Ciudad</Form.Label>
                          <Form.Control
                            value={location.ciudad}
                            type="text"
                            onChange={(e) => {
                              setLocation({
                                ...location,
                                ciudad: e.target.value,
                              });
                              setClient({
                                ...client,
                                direccion: `${location.direccion}, ${e.target.value}, ${location.departamento}`,
                              });
                            }}
                            placeholder=""
                          />
                        </Form.Group>

                        <Form.Group as={Col} controlId="formGridLocation">
                          <Form.Label>Departamento</Form.Label>
                          <Form.Control
                            value={location.departamento}
                            type="text"
                            onChange={(e) => {
                              setLocation({
                                ...location,
                                departamento: e.target.value,
                              });
                              setClient({
                                ...client,
                                direccion: `${location.direccion}, ${location.ciudad}, ${e.target.value}`,
                              });
                            }}
                            placeholder=""
                          />
                        </Form.Group>
                      </Row>

                      <Row>
                        <Form.Group as={Col} controlId="formGridZone">
                          <Form.Label>Dirreccion</Form.Label>
                          <Form.Control
                            value={location.direccion}
                            type="text"
                            onChange={(e) => {
                              setLocation({
                                ...location,
                                direccion: e.target.value,
                              });
                              setClient({
                                ...client,
                                direccion: `${e.target.value}, ${location.ciudad}, ${location.departamento}`,
                              });
                            }}
                            placeholder=""
                          />
                        </Form.Group>
                        <Form.Group as={Col} controlId="formGridCity">
                          <Form.Label>Estrato</Form.Label>
                          <select
                            className="form-select"
                            value={client.estrato}
                            onChange={(e) =>
                              setClient({ ...client, estrato: e.target.value })
                            }
                            required
                            id="inputGroupSelect01"
                          >
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="6">6</option>
                          </select>
                        </Form.Group>
                      </Row>
                    </div>
                  ) : (
                    <></>
                  )}

                  <div className="buttonSubmit">
                    <Button variant="warning" type="submit">
                      Actualizar
                    </Button>
                  </div>
                </Form>
              </div>
            ) : (
              <div>
                {noEncontrado ? <h2> Identificacion no encontrada </h2> : <></>}
              </div>
            )}
            <Modal show={show} onHide={handleClose}>
              {newUser ? (
                <div>
                  <Modal.Header>
                    <Modal.Title>Cliente actualizado</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <div className="newClient" id="userInfo">
                      <div className="top_section">
                        <img
                          src={require("../../media/imago.png")}
                          width={280}
                          alt="imago"
                        />
                      </div>
                      <h2>
                        {newUser.rol}: {newUser.nombre} {newUser.apellidos}{" "}
                        actualizado
                      </h2>
                      <h2>
                        CC:{newUser.cedula} y correo: {newUser.email}
                      </h2>
                    </div>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                      Cerrar
                    </Button>
                    <Button variant="primary" onClick={printUserInfo}>
                      Imprimir registro
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
  );
}

export default OperatorUpdateClient;
