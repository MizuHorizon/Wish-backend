import Express from "express";
const app = Express.Router();
import prisma from "../../prisma/index";
const { user,product } = prisma;
import userRoutes from "../v1/userRoutes";
import productRoutes from "../v1/productRoutes";



app.get("/stats",async(req,res)=>{
  const u = await user.findMany();
  const p = await product.findMany();
      return res.status(200).json({
         message : "SuccessFully fetched server stats!",
         success:true,
         data : {
           users : u.length,
           products : p.length,
         }
      })
})
app.get("/check", (req, res) => {
  res.status(200).json({ message: "Hello  OK From the Server" });
});

app.use("/user", userRoutes);
app.use("/product", productRoutes);

export default app;
