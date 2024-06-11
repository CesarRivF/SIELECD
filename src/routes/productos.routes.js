import { Router } from "express";
import { prisma } from "../db.js";

const router = Router();

//------------Ruta Productos------------//
//Peticiones//
//Trae todas las peticiones juntas//
router.get("/", async (req, res) => {
  const products = await prisma.producto.findMany({
    include: {
      categoria: true,
    },
  });
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
  const body = await crearActualizaCategoria(req.body);
  try {
    const newProduct = await prisma.producto.create({
      data: body,
    });
    res.json(newProduct);
  } catch (error) {
    console.log(error);
    if (error.code == "P2003") {
      res
        .status(409)
        .send("La categoria con el id " + body.categoria_Id + " no existe.");
    }
  }
});

const obtenerCategoriaPorNombre = async (categoria) => {
  return await prisma.categoria.findFirst({
    where: {
      nombre: categoria,
    },
  });
};

const crearNuevaCategoria = async (nombreCategoria) => {
  return await prisma.categoria.create({
    data: {
      nombre: nombreCategoria,
    },
  });
};

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
    console.log(error);
    if (error.code == "P2025") {
      res
        .status(409)
        .send("El producto con el id " + req.params.id + " no existe.");
    }
    res.status(409).send("Ocurrio un error general");
  }
});

//Actualizar los datos de una peticion en particular por medio su Id//
router.put("/:id", async (req, res) => {
  try {
    const body = await crearActualizaCategoria(req.body);
    const productUpdate = await prisma.producto.update({
      where: {
        id: parseInt(req.params.id),
      },
      data: body,
    });
    return res.json(productUpdate);
  } catch (error) {
    console.log(error);
    if (error.code == "P2025") {
      res
        .status(409)
        .send("El producto con el id " + req.params.id + " no existe.");
    }
  }
});

const crearActualizaCategoria = async (body) => {
  const cat = body.categoria;
  const categoria = await obtenerCategoriaPorNombre(cat);
  if (categoria != null) {
    body.categoria_Id = categoria.id;
  } else {
    const nuevaCategoria = await crearNuevaCategoria(cat);
    body.categoria_Id = nuevaCategoria.id;
  }
  delete body.categoria;
  return body;
};

export default router;
