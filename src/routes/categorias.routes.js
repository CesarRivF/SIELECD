import { Router } from "express";
import { prisma } from "../db.js";

const router = Router();

//Ruta//

router.get("/", async (req, res) => {
  const categories = await prisma.categoria.findMany();
  res.json(categories);
});

router.get("/:categoriaId", async (req, res) => {
  const categoria = await prisma.categoria.findFirst({
    where: {
      id: parseInt(req.params.categoriaId),
    },
    include: {
      productos: true,
    },
  });
  res.json(categoria);
});

router.post("/", async (req, res) => {
  // console.log("request:", req.body)
  const body = req.body;

  const newProduct = await prisma.categoria.create({
    data: body,
  });
  res.json(newProduct);
});

export default router;
