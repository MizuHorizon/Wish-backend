import { IUser } from "../interface/utilInterface";
import UserService from "../services/userServices";
const userService = new UserService();
import {Request,Response} from 'express';

export const googleSignIn = async(req:Request,res:Response)=>{
    try{
        const userData:IUser = {
            name: req.body.name,
            email: req.body.email,
            profile_pic: req.body.profile_pic,
            password: "null",
            email_token: null,
            is_verified: true,
            username: req.body.email.split("@")[0],
        };
        console.log(userData);
        const response = await userService.googleSignIn(userData);

        return res.status(201).json({
            message: "Successfully Signed In",
            data: response,
            err: {},
            success: true,
          });


    }catch(error){
        console.log(error);
        return res.status(501).json({
            message : "Something went wrong while google singing the user",
            success : false,
            err : error ,
            data : ""
        });
    }
}

export const updateFcmToken = async(req:Request,res:Response)=>{
    try {

        const userId:string = req.params.id;
        const token:string = req.body.fcmtoken;
        const _user = await userService.updateFcmToken(userId,token);

          return res.status(200).json({
            message: "Successfully Updated Token",
            data: _user,
            err: {},
            success: true,
          });
    } catch (error) {
        console.log(error);
        return res.status(501).json({
            message : "Something went wrong while updating the user",
            success : false,
            err : error ,
            data : ""
        });
    }  
    
}

export const signIn = async(req:Request,res:Response) => {
    try {
        const response = await userService.signIn(
            req.body.email,
            req.body.password
          );
          return res.status(201).json({
            message: "Successfully Signed In",
            data: response,
            err: {},
            success: true,
          });
    } catch (error) {
        console.log(error);
        return res.status(501).json({
            message : "Something went wrong while singing the user",
            success : false,
            err : error ,
            data : ""
        });
    }
}
export const createUser = async(req:Request,res:Response)=>{
    try {
        const userData:IUser ={
            username: req.body.email.toString().split("@")[0],
            name: req.body.name,
            email: req.body.email,
            profile_pic: req.body.profile_pic ?? "",
            password:req.body.password,
            email_token: null,
            is_verified: false
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
            return res.status(200).json({
                message : "Successfully fetched the user!",
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

