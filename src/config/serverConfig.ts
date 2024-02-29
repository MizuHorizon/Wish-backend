import dotenv from "dotenv";
dotenv.config();

let config = { 
    PORT : process.env.PORT,
    SALT:process.env.SALT,
    JWT_KEY:process.env.JWT_KEY,
    MESSAGE_BROKER_URL:process.env.MESSAGE_BROKER_URL,
    QUEUE_NAME:process.env.QUEUE_NAME,
    EXCHANGE_NAME:process.env.EXCHANGE_NAME,
    BINDING_KEY:process.env.BINDING_KEY
}

export default config;