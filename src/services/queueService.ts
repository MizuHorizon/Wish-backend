import amqplib from "amqplib";
import env from "../config/serverConfig";
import ProductService from "./productService";
const productService = new ProductService();
import {getProductDetails} from "../middlewares/getProductDetails";
import { IProduct, IScrapredProduct } from "../interface/utilInterface";



export const createChannel = async () => {
  try {
    const connection = await amqplib.connect(env.MESSAGE_BROKER_URL as string);
    const channel = await connection.createChannel();
    await channel.assertExchange(env.EXCHANGE_NAME as string, "direct");
    return channel;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const subscribeMessage = async (
  channel: amqplib.Channel,
  binding_key: any
) => {
  try {
    const serviceQueue = await channel.assertQueue(env.QUEUE_NAME as string);
    channel.bindQueue(
      serviceQueue.queue,
      env.EXCHANGE_NAME as string,
      binding_key
    );
    channel.consume(serviceQueue.queue, async(message: any) => {
      console.log("product request recieved", message.content.toString());
      let data = JSON.parse(message.content);
      console.log(data);
      // here we have to process the logic
      
      let scrapeProd:IScrapredProduct = await getProductDetails(data.url,data.tags);


      
      const productData: IProduct = {
        name: scrapeProd.name,
        user_id: data.user_id,
        url: data.url,
        tags: scrapeProd.tags,
        currencySymbol: scrapeProd.currencySymbol,
        company: scrapeProd.org,
        start_price: Number(scrapeProd.price),
        desired_price: Number(data.desired_price) ?? 0,
        prices: scrapeProd.prices?? [
          JSON.stringify({ price: Number(100), date: new Date() }),
        ],
        description: data.description ?? "",
        trackable: Boolean(data.trackable) ?? false,
        photos: scrapeProd.photos as [],
      };
      console.log(productData);
      const _product = await productService.createProduct(productData);
      console.log(_product)  
      channel.ack(message);
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const publishMessage = async (
  channel: amqplib.Channel,
  binding_key: any,
  message: any
) => {
  try {
    await channel.publish(
      env.EXCHANGE_NAME as string,
      binding_key,
      Buffer.from(JSON.stringify(message))
    );
  } catch (error) {
    console.log(error);
    throw error;
  }
};
