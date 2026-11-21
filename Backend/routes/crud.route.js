import { Router } from "express";
import { validate } from "../middleware/validate.middleware.js";
import { idParams, reorderBody } from "../validators/common.js";
import { createCrudController } from "../controllers/crud.controller.js";

/**
 * Router for one orderable collection:
 *   GET    /          list (including hidden items)
 *   POST   /          create
 *   PATCH  /reorder   { ids } in display order
 *   GET    /:id       read
 *   PUT    /:id       partial update
 *   DELETE /:id       delete
 */
export function createCrudRouter(Model, label, schema) {
  const controller = createCrudController(Model, label);
  const router = Router();

  router.get("/", controller.list);
  router.post("/", validate({ body: schema }), controller.create);
  router.patch("/reorder", validate({ body: reorderBody }), controller.reorder);
  router.get("/:id", validate({ params: idParams }), controller.get);
  router.put("/:id", validate({ params: idParams, body: schema.partial() }), controller.update);
  router.delete("/:id", validate({ params: idParams }), controller.remove);

  return router;
}
