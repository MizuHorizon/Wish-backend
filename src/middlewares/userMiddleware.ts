import { Request, Response } from "express";
import UserService from "../services/userServices";
const userService = new UserService();

export const checkForNonExistingAccount= async(req:Request,res:Response,next:any)=>{
  
    const email = req.body.email;
    const user = await userService.getByEmail(email);
    console.log(email);
    if(!user){
        return res.status(404).json({
            message : "Account with Email Doesn't Exists!",
            success : false,
            data : "",
            error : new Error("Account Not Exists"),
        })
    }
    next();
  

}

export const checkForExistingAccount = async(req:Request,res:Response,next:any)=>{
  
    const email = req.body.email;
    const user = await userService.getByEmail(email);

    if(user){
        return res.status(404).json({
            message : "Account with Email Exists already!",
            success : false,
            data : "",
            error : new Error("Account Exists"),
        })
    }
    next();
  

}