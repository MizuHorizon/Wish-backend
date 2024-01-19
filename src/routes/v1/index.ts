import  Express  from "express";
const app = Express.Router();

import userRoutes from '../v1/userRoutes';


app.get("/check",(req,res)=>{
    res.status(200).json({message : "Hello  OK From the Server"});
})

app.use("/user",userRoutes);

export default app;