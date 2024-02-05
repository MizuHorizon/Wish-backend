import Express  from "express";
const app = Express();
import {createUser,googleSignIn,getById,getByuserName,signIn} from "../../controllers/userController";
console.log("ok here is the request");
app.post("/",createUser);
app.post("/signin",signIn);
app.get("/:id",getById);
app.get("/",getByuserName);
app.post("/google",googleSignIn);

export default app;