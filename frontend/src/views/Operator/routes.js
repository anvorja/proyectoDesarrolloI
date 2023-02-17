const dashboardRoutes = [
  {
    path: "/Operador/new-client",
    name: "Registrar cliente",
    icon: "bi bi-person-add",
  },
  {
    path: "/Operador/update-client",
    name: "Modificar cliente",
    icon: "bi bi-person-gear",
  },
  {
    path: "/Operador/new-payment",
    name: "Registrar pago",
    icon: "bi bi-cash-coin",
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
