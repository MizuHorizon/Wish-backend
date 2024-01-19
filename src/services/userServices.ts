import { IUser } from "../interface/utilInterface";
import prisma from "../prisma/index";
const { user } = prisma;

class UserService {
  async createUser(userData: IUser): Promise<IUser> {
    try {
      const _user: IUser = await user.create({
        data:{
          username : userData.username,
          email:userData.email,
          name:userData.name,
          profile_pic:userData.profile_pic,
        },
      });
      return _user;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  async getUserById(userId: string): Promise<IUser | null> {
    try {
      const _user: IUser | null = await user.findUnique({
        where: {
          id: userId,
        },
      });
      return _user;
    } catch (error) {
      console.log(error);
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
