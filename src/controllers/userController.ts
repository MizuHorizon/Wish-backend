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
            message : "Something went wrong while creating the user!",
            err : error,
            data : "",
            success : false,
        })
    }
} 

export const getById =async (req:Request,res:Response) => {
    try {
        const userId:string = req.params.id;
        const user =await userService.getUserById(userId
            );
            return res.status(201).json({
                message : "Successfully created the user!",
                success : false,
                err : "",
                data : user
            });

    } catch (error) {
        return res.status(501).json({
            message : "Something went wrong while fetching the user!",
            err : error,
            data : "",
            success : false,
        })
    }
}

export const getByuserName =async (req:Request,res:Response) => {
    try {
        const username:string = req.query.username as string;
        const user =await userService.getUserByUsername(username);
            return res.status(201).json({
                message : "Successfully created the user!",
                success : false,
                err : "",
                data : user
            });

    } catch (error) {
        return res.status(501).json({
            message : "Something went wrong while fetching the user!",
            err : error,
            data : "",
            success : false,
        })
    }
}

