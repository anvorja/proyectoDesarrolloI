import axios from "axios";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NavbarOperator from "../../components/NavbarUser";
import SidebarUser from "../../components/SidebarUser";
import { useForm } from "../../hooks/useForm";
import errorIcon from "../../media/iconos/advertencia.png";
import americanexp from "../../media/onlinePay/AmericanExpress.png";
import mastercard from "../../media/onlinePay/MasterCard.png";
import visa from "../../media/onlinePay/Visa.png";
import "../../styles/payments.css";
import "../../styles/pendingInvoices.css";
import dashboardRoutes from "./routes";

const initialForm = {
  idCard: "",
  expiration: "",
  cvc: "",
  name: "",
};

const validationsForm = (form) => {
  let errors = {};
  let expirationRegExp = /^(0[1-9]|1[0-2])\/(2[3-9]|[3-6][0-9]|[7][0-2])$/gm;

  if (!form.idCard) {
    errors.idCard = "Campo requerido";
  } else if (form.idCard.length != 19) {
    errors.idCard = "Campo incompleto";
  }

  if (!form.expiration) {
    errors.expiration = "Campo requerido";
  } else if (form.expiration.length != 5) {
    errors.expiration = "Campo incompleto";
  } else if (!expirationRegExp.test(form.expiration)) {
    errors.expiration = "Fecha no valida";
  }

  if (!form.cvc) {
    errors.cvc = "Campo requerido";
  } else if (form.cvc.length != 4) {
    errors.cvc = "Campo incompleto";
  }

  if (!form.name) {
    errors.name = "Campo requerido";
  }

  return errors;
};

function ClientNewPayment() {
  let { fact_id } = useParams();
  const idCard = JSON.parse(localStorage.getItem("loggedUser")).cedula;
  const [paymentData, setPaymentData] = useState({});
  const [invoice, setInvoice] = useState({});
  const [showMensaje, setshowMensaje] = useState(false);

  const navigate = useNavigate();
  useEffect(() => {
    async function getFacts() {
      await axios({
        method: "get",
        url: "http://127.0.0.1:8000/cliente/facturacion/" + idCard,
      }).then(function (responseFac) {
        const facts = responseFac.data.clientInfo.invoices.sort(
          (a, b) => b.id - a.id
        );
        if (fact_id === undefined) {
          let factura = facts[0];
          if (factura === undefined) {
            factura = {};
            setshowMensaje(true);
          } else {
            if (factura.estadoPago == "Pagado") {
              factura = facts.find((fact) => fact.estadoPago != "Pagado");
              if (factura === undefined) {
                factura = {};
                setshowMensaje(true);
              }
            }
            setPaymentData({
              monto: factura.costoTotal,
              numeroFactura: facts[0].id,
            });
            setInvoice(factura);
          }
        } else {
          let factura = facts.find((fact) => fact.id == fact_id);
          if (factura === undefined) {
            navigate("/Cliente/new-payment/");
          } else {
            setPaymentData({
              monto: factura.costoTotal,
              numeroFactura: factura.id,
            });
            setInvoice(factura);
          }
        }
      });
    }
    getFacts();
  }, [fact_id]);
  const {
    form,
    errors,
    loading,
    response,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useForm(initialForm, validationsForm, paymentData);

  return (
    <>
      <div className="wrapper">
        <SidebarUser routes={dashboardRoutes} />

        <div className="contentPage">
          <NavbarOperator />
          <div className="content">
            <div className="container clientPayment">
              {JSON.stringify(invoice) !== JSON.stringify({}) ? (
                <div className="row">
                  <motion.div
                    exit={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    className="container pendingInvoices"
                  >
                    <article className="col-12 row">
                      <h2 className="">Factura #{invoice.id}</h2>
                      <div className="infoGroup d-flex justify-content-around">
                        <p className="left">Fecha de expedición</p>
                        <p className="rigth date">{invoice.fechaPago}</p>
                      </div>
                      <div className="infoGroup d-flex justify-content-around">
                        <p className="left">Fecha de vencimiento</p>
                        <p className="rigth date">{invoice.fechaVencimiento}</p>
                      </div>
                      <div className="infoGroup d-flex justify-content-around">
                        <p className="left">Costo total</p>
                        <p className="rigth resaltar">${invoice.costoTotal}</p>
                      </div>
                      <div className="infoGroup d-flex justify-content-around">
                        <p className="left">Estado de pago</p>
                        <p className="rigth">{invoice.estadoPago}</p>
                      </div>
                    </article>
                  </motion.div>
                  <motion.div
                    exit={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    className="col-6 rigthZone"
                  >
                    <form
                      onSubmit={handleSubmit}
                      className="d-flex flex-column align-items-center"
                    >
                      <p
                        style={{
                          marginBottom: "100px",
                          marginTop: "50px",
                          color: "hsla(0,0%,10%,.5)",
                          fontSize: "15px",
                        }}
                      >
                        Paga con tu tarjeta
                      </p>
                      <div className="input-group_">
                        <label>Numero de tarjeta</label>
                        <input
                          name="idCard"
                          className="largeInput"
                          placeholder="1234 1234 1234 1234"
                          maxLength={19}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={form.idCard}
                        ></input>
                        {errors.idCard && (
                          <div className="errorMsg">
                            <img src={errorIcon}></img>
                            <p>{errors.idCard}</p>
                          </div>
                        )}
                        <div className="acceptedCards">
                          <img src={visa}></img>
                          <img src={mastercard}></img>
                          <img src={americanexp}></img>
                        </div>
                      </div>
                      <div className="input-group_">
                        <label>Fecha de expiración</label>
                        <input
                          name="expiration"
                          placeholder="MM/YY"
                          maxLength={5}
                          type={"text"}
                          onChange={handleChange}
                          value={form.expiration}
                          onBlur={handleBlur}
                        ></input>
                        {errors.expiration && (
                          <div className="errorMsg">
                            <img src={errorIcon}></img>
                            <p>{errors.expiration}</p>
                          </div>
                        )}
                      </div>
                      <div className="input-group_">
                        <label>Numero de seguridad</label>
                        <input
                          name="cvc"
                          placeholder="CVC"
                          maxLength={4}
                          type={"text"}
                          onChange={handleChange}
                          value={form.cvc}
                          onBlur={handleBlur}
                        ></input>
                        {errors.cvc && (
                          <div className="errorMsg">
                            <img src={errorIcon}></img>
                            <p>{errors.cvc}</p>
                          </div>
                        )}
                      </div>
                      <div className="input-group_">
                        <label>Nombre en la tarjeta</label>
                        <input
                          name="name"
                          className="largeInput"
                          placeholder="John Doe"
                          type={"text"}
                          onChange={handleChange}
                          value={form.name}
                          onBlur={handleBlur}
                        ></input>
                        {errors.name && (
                          <div className="errorMsg">
                            <img src={errorIcon}></img>
                            <p>{errors.name}</p>
                          </div>
                        )}
                      </div>

                      <input type={"submit"} value={"Enviar"}></input>
                    </form>
                  </motion.div>
                </div>
              ) : (
                <div>
                  {showMensaje ? (
                    <motion.div
                      exit={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      initial={{ opacity: 0, scale: 0.5 }}
                    >
                      <p className="no-pendings">
                        ¡Estas al dia con tus facturas!
                      </p>
                    </motion.div>
                  ) : (
                    <></>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ClientNewPayment;
