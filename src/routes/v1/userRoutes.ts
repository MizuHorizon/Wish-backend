import Express  from "express";
const app = Express();
import {createUser,googleSignIn,updateFcmToken,getById,getByuserName,signIn} from "../../controllers/userController";
import {checkForExistingAccount,checkForNonExistingAccount} from "../../middlewares/userMiddleware";

app.post("/",checkForExistingAccount,createUser);
app.post("/signin",checkForNonExistingAccount,signIn);
app.post("/updatefcm/:userid",updateFcmToken);
app.get("/:id",getById);
app.get("/",getByuserName);
app.post("/google",googleSignIn);

export default app;