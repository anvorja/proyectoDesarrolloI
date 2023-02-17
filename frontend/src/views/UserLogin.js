import axios from "axios";
import { motion } from "framer-motion";
import { gapi } from "gapi-script";
import React, { Children, useEffect, useRef, useState } from "react";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { GoogleLogin } from "react-google-login";
import ReCAPTCHA from "react-google-recaptcha";
import { useLocation, useNavigate } from "react-router-dom";
import { logoutHandler } from "../components/NavbarUser";
import logo from "../media/logInResources/logo.png";
import "../styles/Login.css";

function UserLogin({ children }) {
  const [showError, setShowError] = useState(null);
  const [showInactivo, setShowInactivo] = useState(null);
  const [successLogin, setSuccessLogin] = useState(false);
  const [showCargando, setShowCargando] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const [authChildren, setAuthChildren] = useState(false);
  const [captchaValidate, setCaptchaValidate] = useState(false);
  const captcha = useRef(null);
  const navigate = useNavigate();
  let location = useLocation();
  const [login, setLogin] = useState({
    cedula: "",
    password: "",
  });
  useEffect(() => {
    if (localStorage.getItem("loggedUser") !== null) {
      const { access } = JSON.parse(localStorage.getItem("token"));
      axios.defaults.headers.common["Authorization"] = "Bearer " + access;
      const { rol } = JSON.parse(localStorage.getItem("loggedUser"));
      if (Children.count(children) === 0) {
        setAuthChildren(true);
        navigate("/" + rol + "/");
      } else {
        let urlRol = location.pathname.split("/")[1];
        const { rol } = JSON.parse(localStorage.getItem("loggedUser"));
        if (urlRol === rol) {
          setAuthChildren(true);
        }
      }
    }
  }, [successLogin]);
  const captchaHandler = () => {
    if (captcha.current.getValue()) {
      setCaptchaValidate(true);
    } else {
      setCaptchaValidate(false);
    }
  };
  useEffect(() => {
    const start = () => {
      gapi.auth2.init({
        clientId:
          "1062961637715-mlnoer3e29rjavithgfjids2vdbkghcc.apps.googleusercontent.com",
      });
    };
    gapi.load("client:auth2", start);
  }, []);
  const onGoogleLoginSuccess = async (response) => {
    setShowCargando(true);
    const idToken = response.tokenId;
    const data = {
      email: response.profileObj.email,
    };

    const headers = {
      Authorization: idToken,
      "Content-Type": "application/json",
    };
    await axios
      .post("http://localhost:8000/login/google/", data, {
        headers: headers,
      })
      .then(async function (response) {
        localStorage.setItem("token", JSON.stringify(response.data));
        axios.defaults.headers.common["Authorization"] =
          "Bearer " + response.data.access;
        setLogin({ ...login, cedula: response.data.cedula });
        await axios({
          method: "get",
          url:
            "http://localhost:8000/api/usuario/" + response.data.cedula + "/",
        }).then(function (responseUser) {
          if (responseUser.data.estado === "Activo") {
            localStorage.setItem(
              "loggedUser",
              JSON.stringify(responseUser.data)
            );
            setSuccessLogin(true);
            setShowCargando(false);

            const intervalId = setInterval(async () => {
              await axios({
                method: "post",
                url: "http://localhost:8000/api/token/verify/",
                data: {
                  token: JSON.parse(localStorage.getItem("token")).access,
                },
              }).catch((err) => {
                logoutHandler();
                setShowLogout(true);
              });
            }, 60000);
            localStorage.setItem("intervalId", intervalId);
          }
          else{
            setShowCargando(false);
            setShowInactivo(true);
          }
        });
      })
      .catch(function (response) {
        setShowError(true);
        setShowCargando(false);
      });
    setShowCargando(false);
  };
  const onGoogleLoginFailure = (e) => {
    console.log({ e, a: "fallo" });
  };
  const loginHandler = async (e) => {
    e.preventDefault();
    setShowCargando(true);
    await axios({
      method: "post",
      url: "http://localhost:8000/api/token/",
      data: login,
    })
      .then(async function (response) {
        localStorage.setItem("token", JSON.stringify(response.data));
        axios.defaults.headers.common["Authorization"] =
          "Bearer " + response.data.access;
        await axios({
          method: "get",
          url: "http://localhost:8000/api/usuario/" + login.cedula + "/",
        }).then(function (responseUser) {
          if (responseUser.data.estado === "Activo") {
            localStorage.setItem(
              "loggedUser",
              JSON.stringify(responseUser.data)
            );
            setSuccessLogin(true);
            setShowCargando(false);

            const intervalId = setInterval(async () => {
              await axios({
                method: "post",
                url: "http://localhost:8000/api/token/verify/",
                data: {
                  token: JSON.parse(localStorage.getItem("token")).access,
                },
              }).catch((err) => {
                logoutHandler();
                setShowLogout(true);
              });
            }, 60000);

            localStorage.setItem("intervalId", intervalId);
          }
          else{
            setShowCargando(false);
            setShowInactivo(true);
          }
        });
      })
      .catch(function (response) {
        setLogin({
          cedula: "",
          password: "",
        });
        setShowError(true);
        setShowCargando(null);
      });
  };

  useEffect(() => {
    const verifyToken = async () => {
      if (authChildren) {
        await axios({
          method: "post",
          url: "http://localhost:8000/api/token/verify/",
          data: { token: JSON.parse(localStorage.getItem("token")).access },
        }).catch((err) => {
          logoutHandler();
          setShowLogout(true);
        });
      }
    };
    verifyToken();
  }, [authChildren]);

  return (
    <div>
      {localStorage.getItem("loggedUser") ? (
        <div>
          {authChildren ? (
            children
          ) : (
            <div className="home_container">
              <Modal show={true} centered>
                <Modal.Footer>
                  <h3>Esta vista no esta disponible para usted</h3>
                  <Button
                    variant="warning"
                    href={
                      "/" + JSON.parse(localStorage.getItem("loggedUser")).rol
                    }
                  >
                    volver a:{" "}
                    {JSON.parse(localStorage.getItem("loggedUser")).rol}
                  </Button>
                </Modal.Footer>
              </Modal>
            </div>
          )}
        </div>
      ) : (
        <div className="wrapper">
          <div className="loginContainer">
            <div className="containerFormAndText">
              <div className="containerMiForm">
                <label className="text">Bienvenido</label>
                <Form onSubmit={loginHandler}>
                  <Form.Group as={Col} controlId="formGridCed">
                    <Form.Label>Documento de Identidad:</Form.Label>
                    <Form.Control
                      type="number"
                      value={login.cedula}
                      autoComplete="username"
                      name="username"
                      required
                      onChange={(e) => {
                        setLogin({ ...login, cedula: e.target.value });
                      }}
                      className="form-control"
                    />
                  </Form.Group>
                  <Form.Group as={Col} controlId="formGridPass">
                    <Form.Label>Contraseña:</Form.Label>
                    <Form.Control
                      type="password"
                      value={login.password}
                      name="current-password"
                      required
                      autoComplete="current-password"
                      onChange={(e) => {
                        setLogin({ ...login, password: e.target.value });
                      }}
                      className="form-control"
                    />
                  </Form.Group>
                  {showError ? (
                    <Alert
                      variant="danger"
                      onClose={() => setShowError(null)}
                      dismissible
                    >
                      <Alert.Heading>Datos incorrectos!</Alert.Heading>
                    </Alert>
                  ) : (
                    <div>
                      {showInactivo ? (<Alert
                      variant="danger"
                      onClose={() => setShowInactivo(null)}
                      dismissible
                    >
                      <Alert.Heading>Su usuario ha sido desactivado</Alert.Heading>
                    </Alert>):(<></>)}
                    </div>
                  )}
                  <Modal show={showCargando} centered>
                    <div className="plug">
                      <div className="arrow-1"></div>
                      <div className="plugPuntas">
                        <div className="rec1"></div>
                        <div className="rec2"></div>
                      </div>
                    </div>
                  </Modal>
                  <div className="reCaptcha">
                    <ReCAPTCHA
                      sitekey="6Lf2V70jAAAAAOiSgIDRqwCHQMOj9XzbwaWKul9V"
                      ref={captcha}
                      onChange={captchaHandler}
                    />
                    ,
                  </div>
                  <div className="btn">
                    <Button
                      type="submit"
                      variant="warning"
                      size="lg"
                      disabled={!captchaValidate}
                    >
                      Entrar
                    </Button>
                  </div>
                  <div className="linea_login"></div>
                  <div className="btn">
                    <GoogleLogin
                      clientId={
                        "1062961637715-mlnoer3e29rjavithgfjids2vdbkghcc.apps.googleusercontent.com"
                      }
                      onSuccess={onGoogleLoginSuccess}
                      onFailure={onGoogleLoginFailure}
                    />
                  </div>
                </Form>
              </div>
              <motion.div
                exit={{ opacity: 0, x: "-100%" }}
                animate={{ opacity: 1, x: 0 }}
                initial={{ opacity: 0, x: "-100%" }}
              >
                <Card border="none" bg="transparent">
                  <Button variant="link" href="/">
                    <Card.Img variant="top" src={logo} />
                  </Button>

                  <Card.Body>
                    <Card.Text>
                      Estimado usuario, recuerde que una vez ingrese a la
                      aplicación, encontrará el formulario electrónico para
                      interponer reclamos, recursos y quejas de los servicios
                      públicos domiciliarios y/o de los servicios de
                      comunicaciones.
                      <br />
                      No olvide que puede comunicarse con nosotros a través de
                      la línea (0) 000000, ¡Estamos para servirle!
                    </Card.Text>
                  </Card.Body>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      )}
      <Modal show={showLogout} centered>
        <Modal.Footer>
          <h3>Ha perdido sus credenciales, debe iniciar sesion de nuevo</h3>
          <Button variant="warning" onClick={() => setShowLogout(false)}>
            Login
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default UserLogin;
