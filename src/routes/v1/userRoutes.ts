import Express  from "express";
const app = Express();
import {createUser,googleSignIn,getById,getByuserName,signIn} from "../../controllers/userController";

app.post("/",createUser);
app.post("/signin",signIn);
app.get("/:id",getById);
app.get("/",getByuserName);
app.post("/google",googleSignIn);

export default app;