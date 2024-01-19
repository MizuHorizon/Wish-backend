import Express from "express";
const app = Express.Router();

import userRoutes from "../v1/userRoutes";

import productRoutes from "../v1/productRoutes";

app.get("/check", (req, res) => {
  res.status(200).json({ message: "Hello  OK From the Server" });
});

app.use("/user", userRoutes);
app.use("/product", productRoutes);

export default app;
