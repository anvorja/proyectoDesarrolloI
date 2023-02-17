import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
  PDFViewer,
  pdf,
  usePDF,
} from "@react-pdf/renderer";
import logo from "../media/logo.png";
import publicidad from "../media/publicidad.png";
import { useEffect, useState } from "react";
import axios from "axios";
import { TableRow, TableCell } from "@mui/material";
import { Modal } from "react-bootstrap";
export const myDoc = (cliente) => {
  const invoice = cliente.invoices[0];
  const styles = StyleSheet.create({
    page: {
      flexDirection: "column",
      backgroundColor: "#fff",
    },
    section: {
      padding: 10,
      flexGrow: 1,
      display: "flex",
      width: "60%",
      justifyContent: "center",
      height: "120px",
    },
    logo: {
      flexDirection: "row",
      display: "flex",
      height: "120px",
      alignItems: "center",
      justifyContent: "center",
      width: "300px",
    },
    imgLogo: {
      height: "120px",
      margin: "10px",
    },
    textLogo: {
      fontSize: "30px",
    },
    datos: {
      padding: "10px",
    },
    datosRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      margin: "10px",
    },
  });
  const MyDocument = (
    <Document>
      <Page size="LETTER" style={styles.page}>
        <View style={{ flexDirection: "row" }}>
          <View style={styles.logo}>
            <Image style={styles.imgLogo} src={logo} />
            <Text style={styles.textLogo}>Energy X</Text>
          </View>
          <View style={styles.section}>
            <Text
              style={{ fontSixe: "35px", textAlign: "right", margin: "5px" }}
            >
              {cliente.nombre + " " + cliente.apellidos}
            </Text>
            <Text
              style={{ fontSixe: "35px", textAlign: "right", margin: "5px" }}
            >
              {cliente.clientInfo.direccion}
            </Text>
          </View>
        </View>
        <View>
          <Image style={{ width: "100%", padding: "10px" }} src={publicidad} />
        </View>
        <View style={styles.datos}>
          <View style={styles.datosRow}>
            <Text style={{ fontSixe: "25px" }}>TOTAL A PAGAR</Text>
            <View
              style={{
                width: "300px",
                backgroundColor: "#ffc000",
                paddingLeft: "10px",
              }}
            >
              <Text style={{ fontSixe: "15px" }}>${invoice.costoTotal}</Text>
            </View>
          </View>
          <View style={styles.datosRow}>
            <Text style={{ fontSixe: "25px" }}>FECHA DE EXPEDICÍON</Text>
            <View
              style={{
                width: "300px",
                backgroundColor: "#e4e4e4",
                paddingLeft: "10px",
              }}
            >
              <Text style={{ fontSixe: "15px" }}>{invoice.fechaPago}</Text>
            </View>
          </View>
          <View style={styles.datosRow}>
            <Text style={{ fontSixe: "25px" }}>FECHA DE VENCIMIENTO</Text>
            <View
              style={{
                width: "300px",
                backgroundColor: "#e4e4e4",
                paddingLeft: "10px",
              }}
            >
              <Text style={{ fontSixe: "15px" }}>
                {invoice.fechaVencimiento}
              </Text>
            </View>
          </View>
          <View style={styles.datosRow}>
            <Text style={{ fontSixe: "25px" }}>CONSUMO</Text>
            <View
              style={{
                width: "300px",
                backgroundColor: "#e4e4e4",
                paddingLeft: "10px",
              }}
            >
              <Text style={{ fontSixe: "15px" }}>{invoice.consumo}</Text>
            </View>
          </View>
          <View style={styles.datosRow}>
            <Text style={{ fontSixe: "25px" }}>VALOR UNITARIO KWH</Text>
            <View
              style={{
                width: "300px",
                backgroundColor: "#e4e4e4",
                paddingLeft: "10px",
              }}
            >
              <Text style={{ fontSixe: "15px" }}>803</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
  return MyDocument;
};
const InvoicePdf = ({ cliente, key }) => {
  const [instance, updateInstance] = usePDF({ document: myDoc(cliente) });
  const [showCargando, setShowCargando] = useState(false)
  const [sent, setSent] = useState(false);
  useEffect(() => {
    const sentInvoices = async () => {
      if (instance.blob !== null && !sent) {
        setSent(true);
        const formData = new FormData();
        formData.append("pdf", instance.blob, "invoice.pdf");
        formData.append("nombre", cliente.nombre);
        formData.append("numeroFac", cliente.invoices[0].id);
        formData.append("correo", cliente.email);
        formData.append("costoTotal", cliente.invoices[0].costoTotal);
        await axios({
          method: "post",
          url: "http://127.0.0.1:8000/api/facturacion/send_invoice",
          data: formData,
        })
          .then((res) => setShowCargando(false))
          .catch((err) => setShowCargando(false));
      }
    };
    sentInvoices();
  }, [instance.loading]);

  return (
    <TableRow key={key}>
      <TableCell> {cliente.invoices[0].id}</TableCell>
      <TableCell>
        {" "}
        {cliente.nombre} {cliente.apellidos}
      </TableCell>
      <TableCell> {cliente.invoices[0].fechaPago}</TableCell>
      <TableCell> {cliente.invoices[0].costoTotal}</TableCell>
      <TableCell> {cliente.invoices[0].estadoPago}</TableCell>
      <Modal show={showCargando} centered>
        <Modal.Footer>
          <h1>No cierre la pestaña, ni el navegador mientras se envía la factura</h1>
        </Modal.Footer>
          <div className="plug">
            <div className="arrow-1"></div>
            <div className="plugPuntas">
              <div className="rec1"></div>
              <div className="rec2"></div>
            </div>
          </div>
        </Modal>
    </TableRow>

  );
};

export default InvoicePdf;
