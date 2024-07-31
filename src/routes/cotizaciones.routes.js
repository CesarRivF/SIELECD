import { Router } from "express";
import { prisma } from "../db.js";
import { buildTable } from "../libs/pdfKit.js";

const router = Router();

router.get("/", async (req, res) => {
  const cotizaciones = await prisma.cotizacion.findMany({
    include: {
      cliente: true,
    },
  });
  res.json(cotizaciones);
});

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

router.get("/obtenerUltimoFolio", async (req, res) => {
  const cotizacion = await prisma.cotizacion.findFirst({
    orderBy: {
      id: "desc",
    },
    take: 1,
  });
  console.log(cotizacion);
  if (cotizacion == undefined) {
    res.send({
      ultimoFolio: 0,
    });
    return;
  }
  res.send({
    ultimoFolio: cotizacion.id,
  });
});

router.get("/descargar/:cotizacionId", async (req, res) => {
  const datosCotizacion = await obtenerDatosCotizacion(
    parseInt(req.params.cotizacionId)
  );
  const stream = res.writeHead(200, {
    "Content-Type": "application/pdf",
    "Content-Disposition":
      "attachament; filename=" +
      datosCotizacion.cliente.nombre +
      "_cotizacion_folio_" +
      datosCotizacion.id +
      ".pdf",
  });

  buildTable(
    datosCotizacion,
    (data) => stream.write(data),
    () => stream.end()
  );
});

router.get("/:cotizacionId", async (req, res) => {
  try {
    const cotizacion = await obtenerDatosCotizacion(
      parseInt(req.params.cotizacionId)
    );
    res.json(cotizacion);
  } catch {
    res.send("Error al obtener la cotizacion");
  }
});

const obtenerDatosCotizacion = async (cotizacionId) => {
  return await prisma.cotizacion.findFirst({
    where: {
      id: cotizacionId,
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
};
export default router;
