import express from "express";
import cors from "cors";
import categoriasRoutes from "./routes/categorias.routes.js";
import productosRoutes from "./routes/productos.routes.js";
import clientesRoutes from "./routes/clientes.routes.js";
import cotizacionesRoutes from "./routes/cotizaciones.routes.js";
import productoCotizacionesRoutes from "./routes/productos_cotizaciones.routes.js";
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/categorias", categoriasRoutes);
app.use("/api/productos", productosRoutes);
app.use("/api/clientes", clientesRoutes);
app.use("/api/cotizaciones", cotizacionesRoutes);
app.use("/api/productoCotizaciones", productoCotizacionesRoutes);

app.listen(4000);
console.log("Server on port", 4000);
