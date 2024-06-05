import { Router } from "express";
import { prisma } from "../db.js";

const router = Router();

//------------Ruta Productos------------//
//Peticiones//
//Trae todas las peticiones juntas//
router.get("/", async (req, res) => {
  const products = await prisma.producto.findMany();
  res.json(products);
});

//Trae una peticion en particular por medio de su Id//
router.get("/:id", async (req, res) => {
  const producto = await prisma.producto.findFirst({
    where: {
      id: parseInt(req.params.id),
    },
    include: {
      categoria: true,
    },
  });

  console.log("productoPrisma", producto);

  if (!producto) {
    return res.status(404).json({ error: "Producto no encontrado" });
  }
  return res.json(producto);
});

//Crear una nueva peticion//
router.post("/", async (req, res) => {
  // console.log("request:", req.body)
  const body = req.body;
  try {
    const newProduct = await prisma.producto.create({
      data: body,
    });
    res.json(newProduct);
  } catch (error) {
    if (error.code == "P2003") {
      res
        .status(409)
        .send("La categoria con el id " + body.categoria_Id + " no existe.");
    }
  }
});

//Eliminar una peticion en particular por medio de su Id//
router.delete("/:id", async (req, res) => {
  try {
    const productDeleted = await prisma.producto.delete({
      where: {
        id: parseInt(req.params.id),
      },
    });
    return res.json(productDeleted);
  } catch (error) {
    if (error.code == "P2025") {
      res
        .status(409)
        .send("El producto con el id " + req.params.id + " no existe.");
    }
  }
});

//Actualizar los datos de una peticion en particular por medio su Id//
router.put("/:id", async (req, res) => {
  try {
    const productUpdate = await prisma.producto.update({
      where: {
        id: parseInt(req.params.id),
      },
      data: req.body,
    });
    return res.json(productUpdate);
  } catch (error) {
    if (error.code == "P2025") {
      res
        .status(409)
        .send("El producto con el id " + req.params.id + " no existe.");
    }
  }
});

export default router;
