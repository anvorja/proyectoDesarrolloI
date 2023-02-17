const dashboardRoutes = [
  {
    path: "/Cliente/home",
    name: "Home",
    icon: "bi bi-clipboard-data",
  },

  {
    path: "/Cliente/new-payment",
    name: "Pago en linea",
    icon: "bi bi-credit-card",
  },

  {
    path: "/Cliente/invoice",
    name: "Factura digital",
    icon: "bi bi-receipt",
  },
];

export default dashboardRoutes;

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
