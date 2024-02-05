import dotenv from "dotenv";
dotenv.config();

let config = { 
    PORT : process.env.PORT,
    SALT:process.env.SALT,
    JWT_KEY:process.env.JWT_KEY,
}

export default config;