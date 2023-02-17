import "bootstrap/dist/css/bootstrap.min.css";
import { AnimatePresence } from "framer-motion";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./styles/style.css";
import About from "./views/about";
import AdminCutoffDate from "./views/Admin/AdminCutoffDate";
import AdminNewUser from "./views/Admin/AdminNewUser";
import AdminSearchUser from "./views/Admin/AdminSearchUser";
import AdministradorUpdate from "./views/Admin/AdminUpdate";
import AdminUpdateUser from "./views/Admin/AdminUpdateUser";
import ClienteUpdate from "./views/Client/ClienteUpdate";
import ClientHome from "./views/Client/ClientHome";
import ClientInvoice from "./views/Client/ClientInvoice";
import ClientNewPayment from "./views/Client/ClientNewPayment";
import Home from "./views/home";
import ManagerConsumption from "./views/Manager/ManagerConsumption";
import ManagerLocations from "./views/Manager/ManagerLocations";
import ManagerReports from "./views/Manager/ManagerReports";
import GerenteUpdate from "./views/Manager/ManagerUpdate";
import OperatorNewClient from "./views/Operator/OperatorNewClient";
import OperatorNewPayment from "./views/Operator/OperatorNewPayment";
import OperadorUpdate from "./views/Operator/OperatorUpdate";
import OperatorUpdateClient from "./views/Operator/OperatorUpdateClient";
import UserLogin from "./views/UserLogin";
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <BrowserRouter>
    <AnimatePresence>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login/" element={<UserLogin />} />

        <Route path="/logout" element={<Navigate replace to="/login" />} />

        <Route
          path="/Gerente/"
          element={
            <UserLogin>
              <Navigate replace to="/Gerente/user-report" />
            </UserLogin>
          }
        />
        <Route
          path="/Gerente/user-report"
          element={
            <UserLogin>
              <ManagerReports />
            </UserLogin>
          }
        />
        <Route
          path="/Gerente/client-location/:cedulaCliente"
          element={
            <UserLogin>
              <ManagerLocations />
            </UserLogin>
          }
        />
        <Route
          path="/Gerente/client-location"
          element={
            <UserLogin>
              <ManagerLocations />
            </UserLogin>
          }
        />
        <Route
          path="/Gerente/client-consumption"
          element={
            <UserLogin>
              <ManagerConsumption />
            </UserLogin>
          }
        />
        <Route
          path="/Gerente/update"
          element={
            <UserLogin>
              <GerenteUpdate />
            </UserLogin>
          }
        />

        <Route
          path="/Operador/"
          element={
            <UserLogin>
              <Navigate replace to="/Operador/new-client" />
            </UserLogin>
          }
        />
        <Route
          path="/Operador/new-client"
          element={
            <UserLogin>
              <OperatorNewClient />
            </UserLogin>
          }
        />
        <Route
          path="/Operador/new-payment"
          element={
            <UserLogin>
              <OperatorNewPayment />
            </UserLogin>
          }
        />
        <Route
          path="/Operador/update-client"
          element={
            <UserLogin>
              <OperatorUpdateClient />
            </UserLogin>
          }
        />
        <Route
          path="/Operador/update"
          element={
            <UserLogin>
              <OperadorUpdate />
            </UserLogin>
          }
        />

        <Route
          path="/Administrador/"
          element={
            <UserLogin>
              <Navigate replace to="/Administrador/generate-invoices" />
            </UserLogin>
          }
        />
        <Route
          path="/Administrador/generate-invoices"
          element={
            <UserLogin>
              <AdminCutoffDate />
            </UserLogin>
          }
        />
        <Route
          path="/Administrador/new-user"
          element={
            <UserLogin>
              <AdminNewUser />
            </UserLogin>
          }
        />
        <Route
          path="/Administrador/update-user/:cedula"
          element={
            <UserLogin>
              <AdminUpdateUser />
            </UserLogin>
          }
        />
        <Route
          path="/Administrador/update-user"
          element={
            <UserLogin>
              <AdminUpdateUser />
            </UserLogin>
          }
        />
        <Route
          path="/Administrador/search-user"
          element={
            <UserLogin>
              <AdminSearchUser />
            </UserLogin>
          }
        />
        <Route
          path="/Administrador/update"
          element={
            <UserLogin>
              <AdministradorUpdate />
            </UserLogin>
          }
        />

        <Route
          path="/Cliente/"
          element={
            <UserLogin>
              <Navigate replace to="/Cliente/home" />
            </UserLogin>
          }
        />
        <Route
          path="/Cliente/home"
          element={
            <UserLogin>
              <ClientHome />
            </UserLogin>
          }
        />

        <Route
          path="/Cliente/invoice"
          element={
            <UserLogin>
              <ClientInvoice />
            </UserLogin>
          }
        />
        <Route
          path="/Cliente/new-payment/:fact_id"
          element={
            <UserLogin>
              <ClientNewPayment />
            </UserLogin>
          }
        />
        <Route
          path="/Cliente/new-payment"
          element={
            <UserLogin>
              <ClientNewPayment />
            </UserLogin>
          }
        />
        <Route
          path="/Cliente/update"
          element={
            <UserLogin>
              <ClienteUpdate />
            </UserLogin>
          }
        />
        <Route path="*" element={<Navigate replace to="/" />} />
      </Routes>
    </AnimatePresence>
  </BrowserRouter>
);
