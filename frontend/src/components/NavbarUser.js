import React from "react";
import { NavLink } from "react-router-dom";
import { Navbar } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import "../styles/Navbar.css";
import Button from "react-bootstrap/Button";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
export const logoutHandler = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("loggedUser");
  clearInterval(localStorage.getItem("intervalId"));
  localStorage.removeItem("intervalId");
};

const NavbarUser = ({ printRef }) => {
  const rol = JSON.parse(localStorage.getItem("loggedUser")).rol;
  const handleDownloadPdf = async () => {
    const element = printRef.current;
    const canvas = await html2canvas(element);
    const data = canvas.toDataURL("image/png");

    const pdf = new jsPDF();
    const imgProperties = pdf.getImageProperties(data);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;
    const { cedula } = JSON.parse(localStorage.getItem("loggedUser"));
    pdf.addImage(data, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(cedula + ".pdf");
  };
  return (
    <div className="navbar">
      <Navbar bg="transparent" variant="light">
        <Container>
          <Navbar.Brand href="/">
            <img
              src={require("../media/logo.png")}
              width={70}
              height={70}
              alt={" "}
            />{" "}
            Energy X
          </Navbar.Brand>
          <div className="optionsNavbar">
            {printRef !== undefined ? (
              <Button
                onClick={handleDownloadPdf}
                variant="link"
                style={{ width: "50px", height: "50px", borderRadius: "35px" }}
                className="link_nav"
              >
                <div className="icon">
                  <i className="bi bi-file-earmark-arrow-down"></i>
                </div>
              </Button>
            ) : (
              <></>
            )}

            <NavLink to={"/" + rol + "/update"} className="link_nav">
              <div className="icon">
                <i className="bi bi-gear"></i>
              </div>
            </NavLink>

            <NavLink to="/logout" className="link_nav" onClick={logoutHandler}>
              <div className="icon">
                <i className="bi bi-box-arrow-right"></i>
              </div>
            </NavLink>
          </div>
        </Container>
      </Navbar>
    </div>
  );
};

export default NavbarUser;
