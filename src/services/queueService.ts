import amqplib from "amqplib";
import env from "../config/serverConfig";
import ProductService from "./productService";
const productService = new ProductService();
import {getProductDetails} from "../middlewares/getProductDetails";
import { IProduct, IScrapredProduct } from "../interface/utilInterface";
import {sendNotification} from "../services/firebaseNotificationService";



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

export const subscribeMessageForNotifications = async(channel:amqplib.Channel,binding_key:any)=>{
   try {
      const serviceQueue = await channel.assertQueue(env.QUEUE_NAME2 as string);

      channel.bindQueue(serviceQueue.queue,env.EXCHANGE_NAME as string,binding_key);
      channel.consume(serviceQueue.queue,async(message:any)=>{
        console.log("Notification received:", message.content.toString());
        //logic to for notifications....................................

        const notificationData = JSON.parse(message.content);
        console.log(notificationData);
        
        await sendNotification(notificationData.fcm_token,notificationData.payload);


        channel.ack(message);
      });
   } catch (error) {
     console.log(error);
   }
}

export const subscribeMessageForCreatingProduct = async (
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
    

     // const proxyUrl = await getProxyLink(data.url) as string;

      let scrapeProd:IScrapredProduct = await getProductDetails(data.url,data.tags);
      
      const productData: IProduct = {
        name: scrapeProd.name,
        user_id: data.user_id,
        url: data.url??" ",
        tags: scrapeProd.tags,
        currencySymbol: scrapeProd.currencySymbol,
        company: scrapeProd.org,
        start_price: Number(scrapeProd.price),
        desired_price: Number(data.desired_price) ?? 0,
        prices: scrapeProd.prices?? [
          JSON.stringify({ price: Number(scrapeProd.price), date: new Date() }),
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


// const getProxyLink = async(url:string)=>{
//       try {
//         const browser = await puppeteer.launch({ headless: true,args: [
//           '--no-sandbox',
//           '--disable-setuid-sandbox',
//         ],});
    
//           const page = await browser.newPage();
//           await page.setUserAgent(
//             'AppleWebKit/537.36 (KHTML, like Gecko) Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/91.0.4472.124 Safari/537.36'
//           );
//           await page.setViewport({ width: 1280, height: 800 });
    
//           // Use Puppeteer Extra Stealth Plugin
//           puppeteer.use(StealthPlugin());
    
//           // Navigate the page to a URL
//           await page.goto("https://proxyium.com/", { timeout: 60000 });
//           await page.waitForSelector('#unique-form-control');

//          // Fill the input field with the value "abc"
//          await page.type('#unique-form-control', url);
//           // Click the "GO" button
//           await Promise.all([
//             page.waitForNavigation(), // Wait for navigation to complete
//             page.click('#unique-btn-blue'), // Click the button
//           ]);
      
//           // Get the URL of the second page
//           const secondPageUrl = page.url();
//           console.log('URL of the second page:', secondPageUrl);
//           return secondPageUrl;
         
//       } catch (error) {
//         console.error(error);
//       }
// }

//getProxyLink("https://www.myntra.com/shirts/the+bear+house/the-bear-house-vertical-striped-slim-fit-cotton-casual-shirt/27631100/buy");