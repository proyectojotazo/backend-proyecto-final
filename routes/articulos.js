const express = require("express");
const { Articulo } = require("../models");
const usuariosRouter = require("express").Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

//Upload Articles 
usuariosRouter.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;

    if (id && data) {
      await Articulo.findByIdAndUpdate(id, data)
      res.json("Registro Actualizado.");
    } else {
      res.json({ msj: " Datos insuficientes" });
    }
  } catch (error) {
    res.json(error);
  }

})


// Delete Articles 
usuariosRouter.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id);
    const eliminado = await Articulo.findByIdAndUpdate(id, { active: false });
    res.status(200).json({ msj: "Articulo borrado de forma satifactoria", isOk: true });
  } catch (error) {
    res.status(500).json(error);
  }
})

module.exports = usuariosRouter;
