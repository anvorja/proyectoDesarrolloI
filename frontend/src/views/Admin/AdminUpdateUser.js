import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NavbarOperator from "../../components/NavbarUser";
import SidebarUser from "../../components/SidebarUser";
import dashboardRoutes from "./routes";

import TextField from "@mui/material/TextField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { Dayjs } from "dayjs";
import { motion } from "framer-motion";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";

import axios from "axios";
import { es } from "date-fns/locale";
function AdminUpdateUser() {
  let { cedula } = useParams();
  const today = new Date();
  const [value, setValue] = useState(Dayjs);
  const [location, setLocation] = useState({
    cuidad: "",
    departamento: "",
    direccion: "",
  });
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const [user, setUser] = useState({
    cedula: "",
    nombre: "",
    apellidos: "",
    rol: 0,
    fechaNacimiento: `${today.getFullYear()}-${
      today.getMonth() + 1
    }-${today.getDate()}`,
    telefono: "",
    email: "",
    password: "",
  });
  const [newUser, setNewUser] = useState(null);
  const [client, setClient] = useState({
    cedula: "",
    direccion: "",
    estrato: "1",
  });
  const [noEncontrado, setNoEncontrado] = useState(false);
  const [ClienteContentVisible, setClienteContentVisible] = useState(false);
  const [userContentVisible, setUserContentVisible] = useState(false);

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
      url: "http://127.0.0.1:8000/api/usuario/modificar/" + searchId,
      data: user,
    })
      .then(async function (responseUser) {
        const role = responseUser.data.rol;
        if (role === "Cliente") {
          setClient({ ...client, cedula: searchId });
          console.log(client);
          console.log(searchId);
          await axios({
            method: "put", // <----
            url: "http://127.0.0.1:8000/api/cliente/" + searchId + "/",
            data: {
              cedula: searchId,
              direccion: client.direccion,
              estrato: client.estrato,
            },
          }).then(function (responseCliente) {
            setNewUser(responseUser.data);
            setShow(false);
          });
        } else {
          setNewUser(responseUser.data);
          setShow(false);
        }
      })
      .catch(async function (errUser) {
        console.log("fallo user");
        console.log(searchId);
        console.log(errUser);
      });
  };

  const [searchId, setSearchId] = useState(cedula);

  const Cliente = () => {
    return (
      <div className="containerForm" style={{ maxWidth: "800px" }}>
        {user ? (
          <Form onSubmit={submitHandler}>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="formGridLastName">
                <Form.Label>Nombres</Form.Label>
                <Form.Control
                  type="text"
                  required
                  onChange={(e) => setUser({ ...user, nombre: e.target.value })}
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
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
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
                  onChange={(e) => {
                    setUser({ ...user, password: e.target.value });
                  }}
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
                  onChange={(e) => setUser({ ...user, estado: e.target.value })}
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
        ) : (
          <div>
            {noEncontrado ? <h2> Identificacion no encontrada </h2> : <></>}
          </div>
        )}
      </div>
    );
  };

  const Usuario = () => {
    return (
      <div className="containerForm" style={{ maxWidth: "800px" }}>
        {user ? (
          <Form onSubmit={submitHandler}>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="formGridLastName">
                <Form.Label>Nombres</Form.Label>
                <Form.Control
                  type="text"
                  required
                  onChange={(e) => setUser({ ...user, nombre: e.target.value })}
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
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
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
                  onChange={(e) => {
                    setUser({ ...user, password: e.target.value });
                  }}
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
                  onChange={(e) => setUser({ ...user, estado: e.target.value })}
                  id="inputGroupSelect02"
                >
                  <option value="Activo">Activo</option>
                  <option value="Inactivo">Inactivo</option>
                </select>
              </Form.Group>
            </Row>
            <div className="buttonSubmit">
              <Button variant="warning" type="submit">
                Actualizar
              </Button>
            </div>
          </Form>
        ) : (
          <div>
            {noEncontrado ? <h2> Identificacion no encontrada </h2> : <></>}
          </div>
        )}
      </div>
    );
  };

  const searchHandler = async (e) => {
    setShow(true);
    console.log(searchId);
    await axios({
      method: "get",
      url: "http://127.0.0.1:8000/api/usuario/" + searchId + "/",
    })
      .then(async function (responseUser) {
        setUser({ ...responseUser.data, password: "" });

        const { fechaNacimiento } = responseUser.data;
        var date = new Date(fechaNacimiento);
        setValue(date.setDate(date.getDate() + 1));
        if (responseUser.data.rol === "Cliente") {
          await axios({
            method: "get",
            url: "http://127.0.0.1:8000/api/cliente/" + searchId + "/",
          })
            .then(function (response) {
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
              setClient({ ...client, cedula: searchId });
              setShow(false);
            })
            .catch((error) => {
              setNoEncontrado(true);
              setSearchId("");
              setShow(false);
            });
        } else {
          setShow(false);
        }
      })
      .catch((error) => {
        setNoEncontrado(true);
        setSearchId("");
        setShow(false);
      });
  };

  useEffect(() => {
    user.rol === "Cliente"
      ? setClienteContentVisible(true)
      : setClienteContentVisible(false);
    (user.rol === "Operador") |
    (user.rol === "Gerente") |
    (user.rol === "Administrador")
      ? setUserContentVisible(true)
      : setUserContentVisible(false);
  }, [user.rol]);

  useEffect(() => {
    if (cedula !== undefined) {
      searchHandler();
    }
  }, []);

  return (
    <div className="wrapper">
      <SidebarUser routes={dashboardRoutes} />
      <div
        className="contentPage"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <NavbarOperator />
        <div
          className="content"
          style={{
            flexDirection: "column",
            position: "relative",
            width: "100%",
            justifyContent: "flex-start",
            display: "flex",
            alignItems: "center",
          }}
        >
          <motion.div
            exit={{ opacity: 0, scaleX: 0.5 }}
            animate={{ opacity: 1, scaleX: 1 }}
            initial={{ opacity: 0, scaleX: 0.7 }}
            className="containerForm"
            style={{ width: "100%", maxWidth: "670px" }}
          >
            <InputGroup className="mb-3">
              <Form.Control
                type="text"
                placeholder="CC del usuario"
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
          </motion.div>
          {ClienteContentVisible && <Cliente />}
          {userContentVisible && <Usuario />}
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
                      CC:{newUser.cedula} y contraseña: {newUser.password}
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
      </div>
    </div>
  );
}

export default AdminUpdateUser;
