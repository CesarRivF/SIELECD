import { Router } from "express";
import { prisma } from "../db.js";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const body = req.body;
    const nuevaCotizacion = await prisma.cotizacion.create({
      data: body,
    });
    res.json(nuevaCotizacion);
  } catch (error) {
    if (error.code == "P2003") {
      res
        .status(409)
        .send("El cliente con el id " + req.body.clienteId + " no existe.");
    }
  }
});

router.get("/:cotizacionId", async (req, res) => {
  const cotizacion = await prisma.cotizacion.findFirst({
    where: {
      id: parseInt(req.params.cotizacionId),
    },
    include: {
      cliente: true,
      productos: {
        select: {
          cantidad: true,
          producto: true,
        },
      },
    },
  });
  res.json(cotizacion);
});

export default router;
