import TextField from "@mui/material/TextField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import axios from "axios";
import { es } from "date-fns/locale";
import { Dayjs } from "dayjs";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import NavbarUser from "../components/NavbarUser";

function UserUpdate() {
  const today = new Date();
  const [value, setValue] = useState(Dayjs);

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

  const submitHandler = async (e) => {
    setShow(true);
    e.preventDefault();
    const { cedula } = JSON.parse(localStorage.getItem("loggedUser"));
    await axios({
      method: "put", // <----
      url: "http://127.0.0.1:8000/api/usuario/" + cedula + "/",
      data: user,
    }).then(async function (responseUser) {
      setNewUser(responseUser.data);
    });
  };

  useEffect(() => {
    setShow(true);
    async function busquedaUsuario() {
      const { cedula } = JSON.parse(localStorage.getItem("loggedUser"));
      await axios({
        method: "get",
        url: "http://127.0.0.1:8000/api/usuario/" + cedula + "/",
      }).then(async function (responseUser) {
        //setUser(responseUser.data);
        setUser({ ...responseUser.data, password: "" });
        const { fechaNacimiento } = responseUser.data;
        var date = new Date(fechaNacimiento);
        setValue(date.setDate(date.getDate() + 1));
      });
    }
    busquedaUsuario();
    setShow(false);
  }, []);

  const [newUser, setNewUser] = useState(null);

  return (
    <>
      <div className="contentPage">
        <NavbarUser />
        <div className="content">
          <motion.div
            exit={{ opacity: 0, scale: 0.9 }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            className="containerForm"
          >
            <Form onSubmit={submitHandler}>
              <Row className="mb-3">
                <Form.Group as={Col} controlId="formGridCity">
                  <Form.Label>Rol</Form.Label>
                  <select
                    className="form-select"
                    value={user.rol}
                    disabled
                    required
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
                    disabled
                    required
                    placeholder="123456"
                  />
                </Form.Group>
              </Row>
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
                      disabled
                      onChange={() => {}}
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
                    required
                    onChange={(e) =>
                      setUser({ ...user, password: e.target.value })
                    }
                    placeholder="jkA_ty102ow"
                    autoComplete="new-password"
                  />
                </Form.Group>
              </Row>
              <div className="buttonSubmit">
                <Button variant="warning" type="submit">
                  Actualizar
                </Button>
              </div>
            </Form>
            <Modal show={show} onHide={handleClose}>
              {newUser ? (
                <div>
                  <Modal.Header>
                    <Modal.Title>Usuario actualizado</Modal.Title>
                  </Modal.Header>
                  <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                      Cerrar
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
          </motion.div>
        </div>
      </div>
    </>
  );
}

export default UserUpdate;
