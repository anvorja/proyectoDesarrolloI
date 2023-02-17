import React, { useEffect, useState } from "react";

import NavbarOperator from "../../components/NavbarUser";
import SidebarUser from "../../components/SidebarUser";
import dashboardRoutes from "./routes";

import TextField from "@mui/material/TextField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import axios from "axios";
import { es } from "date-fns/locale";
import { Dayjs } from "dayjs";
import { motion } from "framer-motion";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import { pageTransition } from "./routes";
function AdminNewUser() {
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

  const [client, setClient] = useState({
    cedula: "",
    direccion: "",
    estrato: "1",
  });

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
      method: "post",
      url: "http://127.0.0.1:8000/api/usuario/",
      data: user,
    })
      .then(async function (responseUser) {
        if (user.rol === "Cliente") {
          await axios({
            method: "post",
            url: "http://127.0.0.1:8000/api/cliente/",
            data: client,
          }).then(function (responseCliente) {
            setNewUser(responseUser.data);
          });
        } else {
          setNewUser(responseUser.data);
        }
      })
      .catch(async function (errUser) {
        console.log("fallo user");
        console.log(errUser.response.data);
      });
  };

  const [newUser, setNewUser] = useState("Cliente");

  const [ClienteContentVisible, setClienteContentVisible] = useState(false);
  const [GerenteContentVisible, setGerenteContentVisible] = useState(false);
  const [AdministradorContentVisible, setAdministradorContentVisible] =
    useState(false);
  const [OperadorContentVisible, setOperadorContentVisible] = useState(false);

  const Cliente = () => {
    return (
      <div>
        <Row className="mb-3">
          <Form.Group as={Col} controlId="formGridCity">
            <Form.Label>Estrato</Form.Label>
            <select
              className="form-select"
              value={client.estrato}
              onChange={(e) =>
                setClient({ ...client, estrato: e.target.value })
              }
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
          <Form.Group as={Col} controlId="formGridCity">
            <Form.Label>Ciudad</Form.Label>
            <Form.Control
              value={location.cuidad}
              type="text"
              onChange={(e) => {
                setLocation({ ...location, cuidad: e.target.value });
                setClient({
                  ...client,
                  direccion: `${location.direccion}, ${e.target.value}, ${location.departamento}`,
                });
              }}
              placeholder="Cali"
            />
          </Form.Group>
        </Row>
        <Row>
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
                  direccion: `${location.direccion}, ${location.cuidad}, ${e.target.value}`,
                });
              }}
              placeholder="Valle del Cauca"
            />
          </Form.Group>

          <Form.Group as={Col} controlId="formGridZone">
            <Form.Label>Dirreccion</Form.Label>
            <Form.Control
              value={location.direccion}
              type="text"
              onChange={(e) => {
                setLocation({ ...location, direccion: e.target.value });
                setClient({
                  ...client,
                  direccion: `${e.target.value}, ${location.cuidad}, ${location.departamento}`,
                });
              }}
              placeholder="Cra. 65a #12a-145"
            />
          </Form.Group>
        </Row>

        <div className="buttonSubmit">
          <Button variant="warning" type="submit">
            Registrar Cliente
          </Button>
        </div>
      </div>
    );
  };

  const Gerente = () => {
    return (
      <div className="buttonSubmit">
        <Button variant="warning" type="submit">
          Registrar Gerente
        </Button>
      </div>
    );
  };

  const Operador = () => {
    return (
      <div className="buttonSubmit">
        <Button variant="warning" type="submit">
          Registrar Operador
        </Button>
      </div>
    );
  };

  const Administrador = () => {
    return (
      <div className="buttonSubmit">
        <Button variant="warning" type="submit">
          Registrar Administrador
        </Button>
      </div>
    );
  };

  const handleOnChange = (e) => {
    newUser(e.target.value);
  };

  useEffect(() => {
    user.rol === "Cliente"
      ? setClienteContentVisible(true)
      : setClienteContentVisible(false);
    user.rol === "Gerente"
      ? setGerenteContentVisible(true)
      : setGerenteContentVisible(false);
    user.rol === "Administrador"
      ? setAdministradorContentVisible(true)
      : setAdministradorContentVisible(false);
    user.rol === "Operador"
      ? setOperadorContentVisible(true)
      : setOperadorContentVisible(false);
  }, [user.rol]);

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
            <div className="containerForm">
              <Form onSubmit={submitHandler}>
                <Row className="mb-3">
                  <Form.Group as={Col} controlId="formGridCity">
                    <Form.Label>Rol</Form.Label>
                    <select
                      className="form-select"
                      value={user.rol}
                      required
                      onChange={(e) =>
                        setUser({ ...user, rol: e.target.value })
                      }
                      id="inputGroupSelect01"
                    >
                      <option disabled={true} value={0}>
                        Seleccione una opcion
                      </option>
                      <option value="Cliente">Cliente</option>
                      <option value="Gerente">Gerente</option>
                      <option value="Administrador">Administrador</option>
                      <option value="Operador">Operador</option>
                    </select>
                  </Form.Group>
                  <Form.Group as={Col} controlId="formGridCedula">
                    <Form.Label>Numero de Cedula</Form.Label>
                    <Form.Control
                      type="number"
                      value={user.cedula}
                      required
                      onChange={(e) => {
                        setUser({ ...user, cedula: e.target.value });
                        setClient({ ...client, cedula: e.target.value });
                      }}
                      placeholder="123456"
                    />
                  </Form.Group>
                </Row>
                <Row className="mb-3">
                  <Form.Group as={Col} controlId="formGridName">
                    <Form.Label>Nombres</Form.Label>
                    <Form.Control
                      type="text"
                      required
                      onChange={(e) =>
                        setUser({ ...user, nombre: e.target.value })
                      }
                      value={user.nombre}
                      placeholder="Sara"
                    />
                  </Form.Group>
                  <Form.Group as={Col} controlId="formGridLastName">
                    <Form.Label>Apellidos</Form.Label>
                    <Form.Control
                      type="text"
                      required
                      onChange={(e) =>
                        setUser({ ...user, apellidos: e.target.value })
                      }
                      value={user.apellido}
                      placeholder="Smith"
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
                      placeholder="user@dominio.com"
                      autoComplete="username"
                    />
                  </Form.Group>
                </Row>
                <Row className="mb-3">
                  <Form.Group className={"col-sm-6"} controlId="formGrid">
                    <Form.Label>Telefono</Form.Label>
                    <Form.Control
                      type="number"
                      value={user.telefono}
                      required
                      onChange={(e) =>
                        setUser({ ...user, telefono: e.target.value })
                      }
                      placeholder="3110001111"
                      autoComplete="tel"
                    />
                  </Form.Group>
                  <Form.Group as={Col} controlId="formGridPassword">
                    <Form.Label>Contraseña</Form.Label>
                    <Form.Control
                      type="password"
                      value={user.password}
                      onChange={(e) =>
                        setUser({ ...user, password: e.target.value })
                      }
                      required
                      placeholder="jkA_ty102ow"
                      autoComplete="new-password"
                    />
                  </Form.Group>
                </Row>
                {ClienteContentVisible && <Cliente />}
                {GerenteContentVisible && <Gerente />}
                {AdministradorContentVisible && <Administrador />}
                {OperadorContentVisible && <Operador />}
              </Form>
              <Modal show={show} onHide={handleClose}>
                {newUser ? (
                  <div>
                    <Modal.Header>
                      <Modal.Title>Nuevo {newUser.rol} creado</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <div className="newClient" id="userInfo">
                        <img
                          src={require("../../media/imago.png")}
                          width={280}
                          alt="imago"
                        />

                        <h2>
                          {newUser.rol}: {newUser.nombre} {newUser.apellidos}{" "}
                          creado
                        </h2>
                        <h2>
                          CC:{newUser.cedula} y contraseña: {user.password}
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
    </>
  );
}

export default AdminNewUser;
