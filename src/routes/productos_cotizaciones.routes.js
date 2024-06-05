import { Router } from "express";
import { prisma } from "../db.js";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const body = req.body;
    const productoCotizacion = await prisma.producto_Cotizacion.create({
      data: body,
    });
    res.json(productoCotizacion);
  } catch (error) {
    if (error.code == "P2003") {
      res.status(409).send("verifique que el producto y cotizacion exista");
    }
  }
});

export default router;
