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
  let datosCotizacion = await obtenerDatosCotizacion(
    parseInt(req.params.cotizacionId)
  );
  if (!datosCotizacion.total) {
    datosCotizacion = await actualizarTotalDeCotizacion(datosCotizacion);
  }
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

router.get("/actualizarTotal/:cotizacionId", async (req, res) => {
  try {
    const cotizacion = await obtenerDatosCotizacion(
      parseInt(req.params.cotizacionId)
    );
    const cotizacionActualizada = await actualizarTotalDeCotizacion(cotizacion);
    res.json(cotizacionActualizada);
  } catch (error) {
    console.log(error);
    res.send("Error inesperado");
  }
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

router.delete("/:id", async (req, res) => {
  try {
    const cotizacionEliminada = await prisma.cotizacion.delete({
      where: {
        id: parseInt(req.params.id),
      },
    });
    return res.json(cotizacionEliminada);
  } catch (error) {
    console.log(error);
    if (error.code == "P2003") {
      res
        .status(409)
        .send("La cotizacion con el id " + req.params.id + " no existe.");
    }
  }
});

const obtenerDatosCotizacion = async (cotizacionId) => {
  return await prisma.cotizacion.findFirst({
    where: {
      id: cotizacionId,
    },
    include: {
      cliente: true,
      productos: true,
    },
  });
};

const actualizarTotalDeCotizacion = async (cotizacion) => {
  const total = cotizacion.productos.reduce(
    (acc, producto) => acc + producto.importe,
    0
  );
  return await prisma.cotizacion.update({
    where: {
      id: cotizacion.id,
    },
    data: {
      total: total,
    },
    include: {
      cliente: true,
      productos: true,
    },
  });
};
export default router;
