import Express from "express";
const app = Express();

import {
  createProduct,
  getProductbyId,
  getProductbyIdOfUser,
  getTrackableProductbyIdOfUser,
  updatePriceOfProduct,
  deleteProduct,
  disableProductTracker,
  enableProductTracker,
  processProductRequest,
  changeDesiredPrice
} from "../../controllers/productController";

import {getProductDetails} from "../../middlewares/getProductDetails";


//app.post("/:id", getProductDetails,createProduct);
app.post("/:userid", processProductRequest);
app.get("/", getProductbyIdOfUser);
app.get("/track", getTrackableProductbyIdOfUser);
app.patch("/:id", updatePriceOfProduct);
app.get("/:id", getProductbyId);
app.patch("/disable/:id",disableProductTracker);
app.patch("/enable/:id",enableProductTracker);
app.patch("/price/:id",changeDesiredPrice);
app.delete("/:id", deleteProduct);

export default app;
