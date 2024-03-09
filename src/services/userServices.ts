import { IUser } from "../interface/utilInterface";
import prisma from "../prisma/index";
import bcrypt from "bcryptjs";
import env from "../config/serverConfig";
import randomBytes from "randombytes";
import jwt from "jsonwebtoken";

const { user } = prisma;

class UserService {
  async createUser(userData: IUser): Promise<IUser> {
    try {
      const SALT = env.SALT ?? 12;
      const password = bcrypt.hashSync(userData.password, Number(SALT));
      const _user: IUser = await user.create({
        data: {
          password: password,
          email_token: userData.email_token
            ? null
            : randomBytes(32).toString("hex"),
          is_verified: userData.is_verified ?? false,
          username: userData.username,
          email: userData.email,
          name: userData.name,
          profile_pic: userData.profile_pic ?? "https://i.pinimg.com/originals/55/32/f3/5532f32f514cdfc36e80a5408922383e.png",
        },
      });
      return _user;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  checkPassword(userInputPassword: string, encryptedPassword: string) {
    try {
      return bcrypt.compareSync(userInputPassword, encryptedPassword);
    } catch (error) {
      console.log("Something went wrong in password comparison");
      throw error;
    }
  }

  createToken(user: string | object | Buffer) {
    try {
      const result = jwt.sign(user, env.JWT_KEY ?? "abc", { expiresIn: "1h" });
      return result;
    } catch (error) {
      console.log("Something went wrong in token creation.");
      throw error;
    }
  }

  async updateFcmToken(userId:string,token : string){
     try {
      console.log(userId,token);
      const _user = await user.update({
        where :{
          id : userId
        },
        data : {
          fcm_token : token
        }    
      });
      return _user;
     } catch (error) {
     // console.log("Something went wrong in the service while updating the user");
      throw error;
     }
  }

  async googleSignIn(userData: IUser) {
    try {
      const email: string = userData.email;
      console.log(email);
      const _user = await user.findUnique({
        where: {
          email: email,
        },
      });

      
      console.log(_user);
      if (!_user) {
        let _newUser = await this.createUser(userData);
        console.log(_newUser);
        const newJWTtoken = this.createToken({
          userId: _newUser?.id,
          username: _newUser?.username,
        });

        //   user?.password = "";
        //   delete user?.emailToken;
        const exclude = ["password", "emailToken"];
        let resUserData = Object.entries(_user!).reduce((acc, [key, value]) => {
          if (!exclude.includes(key)) {
            acc[key] = value;
          }
          return acc;
        }, {} as { [key: string]: any });

        return { userId: _newUser?.id, token: newJWTtoken, userData: resUserData };
      } else {
        const newJWTtoken = this.createToken({
          userId: _user?.id,
          username: _user?.username,
        });

        //   user?.password = "";
        //   delete user?.emailToken;
        const exclude = ["password", "emailToken"];
        const resUserData = Object.entries(_user!).reduce((acc, [key, value]) => {
          if (!exclude.includes(key)) {
            acc[key] = value;
          }
          return acc;
        }, {} as { [key: string]: any });

        return { userId: _user?.id, token: newJWTtoken, userData: resUserData };
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getByEmail(email : string){
    try {
        const _user = await user.findUnique({
          where : {
            email : email
          }
        });
        return _user;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async signIn(email: string, plainPassword: string) {
    try {
      const _user = await user.findUnique({
        where: {
          email: email,
        },
      });
      const encryptedPassword = _user?.password as string;
      console.log(_user);
      const passwordMatch = this.checkPassword(
        plainPassword,
        encryptedPassword
      );
      console.log("sdfsd");
      if (!passwordMatch) {
        console.log("Password doesn't match");
        throw { error: "Incorrect password" };
      }
      const newJWTtoken = this.createToken({
        userId: _user?.id,
        username: _user?.username,
      });

      //   user?.password = "";
      //   delete user?.emailToken;
      const exclude = ["password", "emailToken"];
      const userData = Object.entries(_user!).reduce((acc, [key, value]) => {
        if (!exclude.includes(key)) {
          acc[key] = value;
        }
        return acc;
      }, {} as { [key: string]: any });

      return { userId: _user?.id, token: newJWTtoken, userData: userData };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getUserById(userId: string) {
    try {
      const _user: IUser | null = await user.findUnique({
        where: {
          id: userId,
        },
      });
      return _user;
    } catch (error) {
     // console.log(error);
      throw error;
    }
  }
  async getUserByUsername(username: string): Promise<IUser | null> {
    try {
      const _user: IUser | null = await user.findUnique({
        where: {
          username: username,
        },
      });
      return _user;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

export default UserService;
