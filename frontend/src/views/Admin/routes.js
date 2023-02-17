const dashboardRoutes = [
  {
    path: "/Administrador/generate-invoices",
    name: "Generar Facturas",
    icon: "bi bi-receipt-cutoff",
  },
  {
    path: "/Administrador/new-user",
    name: "Registrar usuario",
    icon: "bi bi-person-add",
  },
  {
    path: "/Administrador/update-user",
    name: "Modificar usuario",
    icon: "bi bi-person-gear",
  },
  {
    path: "/Administrador/search-user",
    name: "Consultar usuario",
    icon: "bi bi-person-vcard",
  },
];
export const pageTransition = {
  in: {
    opacity: 1,
    scale: 1,
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.2,
    },
  },
  out: { opacity: 0, scale: 0.9 },
};

export default dashboardRoutes;
