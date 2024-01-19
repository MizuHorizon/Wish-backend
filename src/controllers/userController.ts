import { IUser } from "../interface/utilInterface";
import UserService from "../services/userServices";
const userService = new UserService();
import {Request,Response} from 'express';

export const createUser = async(req:Request,res:Response)=>{
    try {
        const userData:IUser ={
            username: req.body.email.toString().split("@")[0],
            name: req.body.name,
            email: req.body.email,
            profile_pic: req.body.profile_pic
        };
        const user = await userService.createUser(userData);
        return res.status(201).json({
            message : "Successfully created the user!",
            success : false,
            err : "",
            data : user
        });
    } catch (error) {
        return res.status(501).json({
            message : "Successfully created the user!",
            err : error,
            data : "",
            success : false,
        })
    }
} 


