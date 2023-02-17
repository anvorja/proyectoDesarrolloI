import "bootstrap-icons/font/bootstrap-icons.css";
import React from "react";
import { NavLink } from "react-router-dom";
import "../styles/Sidebar.css";
function SidebarOperator({ routes}) {
  const user = JSON.parse(localStorage.getItem('loggedUser'))
  return (
    <div className="sidebar">
      <div className="top_section">
        <img src={require("../media/imago.png")} width={280} alt="imago" />
      </div>

      <div className="userInfo">
        <div className="iconU">
          <i className="bi bi-person-circle"></i>
        </div>

        <h2>{user.rol}</h2>
        <h2>{user.nombre} {user.apellidos}</h2>
        <div className="linea"></div>
      </div>

      <div className="options">
        {routes.map((prop, key) => {
          return (
            <NavLink to={prop.path} className="link" key={key}>
              <div className="icon">
                <i className={prop.icon}></i>
              </div>
              {prop.name}
            </NavLink>
          );
        })}
      </div>
    </div>
  );
}

export default SidebarOperator;
