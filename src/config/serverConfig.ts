import dotenv from "dotenv";
dotenv.config();

let config = { 
    PORT : process.env.PORT,
    SALT:process.env.SALT,
    JWT_KEY:process.env.JWT_KEY,
    MESSAGE_BROKER_URL:process.env.MESSAGE_BROKER_URL,
    QUEUE_NAME:process.env.QUEUE_NAME,
    QUEUE_NAME2:process.env.QUEUE_NAME2,
    EXCHANGE_NAME:process.env.EXCHANGE_NAME,
    BINDING_KEY:process.env.BINDING_KEY,
    NOTIFICATION_BINDING_KEY:process.env.NOTIFICATION_BINDING_KEY
}

export default config;