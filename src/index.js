import express from "express";
import cors from "cors";
import morgan from "morgan";
import categoriasRoutes from "./routes/categorias.routes.js";
import productosRoutes from "./routes/productos.routes.js";
import clientesRoutes from "./routes/clientes.routes.js";
import cotizacionesRoutes from "./routes/cotizaciones.routes.js";
import productoCotizacionesRoutes from "./routes/productos_cotizaciones.routes.js";
import { FRONTEND_URL } from "./config.js";
const app = express();

import healthcheck from "./healthcheck.js";

app.use(cors({ origin: FRONTEND_URL }));
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/healthcheck", healthcheck);
app.use("/api/categorias", categoriasRoutes);
app.use("/api/productos", productosRoutes);
app.use("/api/clientes", clientesRoutes);
app.use("/api/cotizaciones", cotizacionesRoutes);
app.use("/api/productoCotizaciones", productoCotizacionesRoutes);

app.listen(4000);
console.log("Server on port", 4000);
