import Express from "express";
const app = Express();

import {
  createProduct,
  getProductbyId,
  getProductbyIdOfUser,
  getTrackableProductbyIdOfUser,
  updatePriceOfProduct,
  deleteProduct,
} from "../../controllers/productController";

app.post("/", createProduct);
app.get("/:id", getProductbyId);
app.get("/", getProductbyIdOfUser);
app.get("/track", getTrackableProductbyIdOfUser);
app.patch("/:id", updatePriceOfProduct);
app.delete("/:id", deleteProduct);

export default app;
