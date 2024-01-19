import Express  from "express";
const app = Express();
import {createUser} from "../../controllers/userController";

app.post("/",createUser);
app.get("/:id")



export default app;