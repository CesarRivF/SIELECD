import { Router } from "express";
import { prisma } from "../db.js";

const router = Router();

//----------------Ruta Clientes------------------//

//Peticiones//
//Trae todas los clientes juntas//
router.get("/", async (req, res) => {
  const clients = await prisma.cliente.findMany();
  res.json(clients);
});

//Trae una peticion en particular por medio de su Id//
router.get("/:id", async (req, res) => {
  const cliente = await prisma.cliente.findFirst({
    where: {
      id: parseInt(req.params.id),
    },
    // include: {
    //     categoria: true,
    // }
  });

  if (!cliente) {
    return res.status(404).json({ error: "Cliente no encontrado" });
  }
  return res.json(cliente);
});

//Crear una nueva peticion//
router.post("/", async (req, res) => {
  const body = req.body;
  try {
    const newClient = await prisma.cliente.create({
      data: body,
    });
    res.json(newClient);
  } catch (error) {
    if (error.code == "P2002") {
      res
        .status(409)
        .send("Ya existe un cliente con este correo:  " + body.correo);
    }
  }
});

//Eliminar una peticion en particular por medio de su Id//

router.delete("/:id", async (req, res) => {
  try {
    const clientDeleted = await prisma.cliente.delete({
      where: {
        id: parseInt(req.params.id),
      },
    });
    return res.json(clientDeleted);
  } catch (error) {
    console.log(error);
    res.status(409).send("No se pudo eliminar el cliente");
  }
});

//Actualizar los datos de una peticion en particular por medio su Id//S
router.put("/:id", async (req, res) => {
  try {
    const clientUpdate = await prisma.cliente.update({
      where: {
        id: parseInt(req.params.id),
      },
      data: req.body,
    });
    return res.json(clientUpdate);
  } catch (error) {
    if (error.code == "P2025") {
      res
        .status(409)
        .send("El cliente con el id " + req.params.id + " no existe.");
    }
  }
});

export default router;
