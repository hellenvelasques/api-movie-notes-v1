const { Router } = require("express");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");

const MovieNotesController = require("../controllers/MovieNotesController");

const movieNotesRoutes = Router();
const movieNotesController = new MovieNotesController();


movieNotesRoutes.use(ensureAuthenticated);


movieNotesRoutes.get("/", movieNotesController.index);
movieNotesRoutes.get("/:id", movieNotesController.show);
movieNotesRoutes.post("/", movieNotesController.create);
movieNotesRoutes.delete("/:id", movieNotesController.delete);

module.exports = movieNotesRoutes; 