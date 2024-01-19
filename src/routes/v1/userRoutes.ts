import Express  from "express";
const app = Express();
import {createUser,getById,getByuserName} from "../../controllers/userController";

app.post("/",createUser);
app.get("/:id",getById);
app.get("/",getByuserName);

export default app;