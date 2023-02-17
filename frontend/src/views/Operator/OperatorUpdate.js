import React from "react";

import SidebarUser from "../../components/SidebarUser";
import UserUpdate from "../UserUpdate";
import dashboardRoutes from "./routes";

function OperadorUpdate() {
  return (
    <>
      <div className="wrapper">
        <SidebarUser routes={dashboardRoutes} />
        <UserUpdate/>
      </div>
    </>
  );
}

export default OperadorUpdate;