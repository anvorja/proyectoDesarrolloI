import axios from "axios";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import BarChart from "../../components/BarChart";
import NavbarOperator from "../../components/NavbarUser";
import SidebarUser from "../../components/SidebarUser";
import logo from "../../media/logo.png";
import publicidad from "../../media/publicity.JPG";
import "../../styles/invoice.css";
import dashboardRoutes, { pageTransition } from "./routes";
function ClientInvoice() {
  const idCard = JSON.parse(localStorage.getItem('loggedUser')).cedula;
  const printRef = useRef();
  const [userInfo, setUserInfo] = useState({
    cedula: 0,
    direccion: "",
    nombre: "",
  });

  const [invoicesInfo, setInvoicesInfo] = useState([]);

  const [lastInvoice, setLastInvoice] = useState({});

  const [axesInfo, setAxesInfo] = useState({ axeX: [], axeY: [] });

  const getInvoiceData = async () => {
    try {
      const res = await axios.get(
        "http://127.0.0.1:8000/cliente/facturacion/" + idCard
      );
      setUserInfo({
        cedula: res.data.clientInfo.cedula,
        direccion: res.data.clientInfo.direccion,
        nombre: `${res.data.nombre} ${res.data.apellidos}`,
      });

      setInvoicesInfo(res.data.clientInfo.invoices);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getInvoiceData();
  }, []);

  useEffect(() => {
    if (invoicesInfo) {
      const lastInv = invoicesInfo[invoicesInfo.length - 1];
      setLastInvoice(lastInv);

      const last5Invoices = invoicesInfo.slice(-5, invoicesInfo.length-1);

      const extractMonths = [...last5Invoices].map((aInvoice) => {
        return dayjs(aInvoice.fechaVencimiento).format("MMM");
      });

      const extractConsumes = [...last5Invoices].map((aInvoice) => {
        return aInvoice.consumo;
      });

      setAxesInfo({ axeX: extractMonths, axeY: extractConsumes });
    }
  }, [invoicesInfo]);


  return (
    <>
      <div className="wrapper">
        <SidebarUser routes={dashboardRoutes}/>
        <div className="contentPage">
          <NavbarOperator printRef={printRef} />
          <motion.div variants={pageTransition} exit="out" animate="in" initial="out"className="content">
            <div ref={printRef} className="container invoiceContainer">
              <header className="row align-items-center justify-content-between">
                <figcaption className="col-4 d-flex">
                  <img src={logo} />
                  <h2 className="align-self-center">Energy X</h2>
                </figcaption>

                <div className="col-8">
                  <p>{userInfo.nombre}</p>
                  <p>{userInfo.direccion}</p>
                </div>
              </header>

              <figure className="row">
                <img className="col-12" src={publicidad} />
              </figure>

              <section className="row">
                <p className="col-6">TOTAL A PAGAR</p>
                <p className="col-6 info resaltar">
                  ${lastInvoice ? lastInvoice.costoTotal : "no content"}
                </p>
                <p className="col-6">FECHA DE EXPEDICIÓN</p>
                <p className="col-6 info">
                  {lastInvoice ? lastInvoice.fechaPago : "no content"}
                </p>
                <p className="col-6">FECHA DE VENCIMIENTO</p>
                <p className="col-6 info">
                  {lastInvoice ? lastInvoice.fechaVencimiento : "no content"}
                </p>
                <p className="col-6">CONSUMO</p>
                <p className="col-6 info">
                  {lastInvoice ? lastInvoice.consumo : "no content"}
                </p>
                <p className="col-6">VALOR UNITARIO KWH</p>
                <p className="col-6 info">
                  {lastInvoice ? lastInvoice.valorUnitariokWh : "no content"}
                </p>
              </section>

              <section className="row barchartZone">
                {axesInfo ? (
                  <BarChart
                    ejeX={axesInfo.axeX}
                    ejeY={axesInfo.axeY}
                    className="col-12"
                  />
                ) : (
                  "no content"
                )}
              </section>

              <section className="row"></section>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}

export default ClientInvoice;