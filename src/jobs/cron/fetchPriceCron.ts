import { CronJob } from "cron";
import admin from "firebase-admin";
import ProductService from "../../services/productService";

import PriceTracker from "../../jobs/scrapper/priceTracker";
import { createChannel, publishMessage } from "../../services/queueService";
import env from "../../config/serverConfig";
import UserService from "../../services/userServices";

const productService = new ProductService();
const userService = new UserService();


const tracker = new PriceTracker();

export const testJob = new CronJob("* * * * *", async function () {
  console.log("sending every minute");
});

export const job = new CronJob("0 * * * *", async function () {
  // Your task to be executed every minute goes here
  console.log("Running a task every hour!");

  const products = await productService.getAllProduct();
  // console.log(products);
  try {
    products.forEach(async (product) => {
      if (product.trackable == true) {
        let priceArray = product.prices;
        let price: number = -1;
        if (product.company === "amazon") {
          try {
            price = await tracker.getFromAmazon(product.url);
            priceArray.push(JSON.stringify({ price: price, date: new Date() }));
          } catch (error) {
            console.log(error);
          }
        }
        if (product.company === "ajio") {
          try {
            price = await tracker.getFromAjio(product.url);
            priceArray.push(JSON.stringify({ price: price, date: new Date() }));
          } catch (error) {
            console.log(error);
          }
        }
        if (product.company === "flipkart") {
          try {
            price = await tracker.getFromFlipKart(product.url);
            priceArray.push(JSON.stringify({ price: price, date: new Date() }));
          } catch (error) {
            console.log(error);
          }
        }
        if (product.company === "myntra") {
          try {
            price = await tracker.getFromMyntra(product.url);
            priceArray.push(JSON.stringify({ price: price, date: new Date() }));
          } catch (error) {
            console.log(error);
          }
        }
        console.log(`fetched price : ${price}`);
        //send it to the queue to send notifications
        if (price != -1 && price <= product.desired_price) {

          //create the payload
          const payload: admin.messaging.MessagingPayload = {
            notification: {
              title: 'Price Drop Alert',
              body: `The price of ${product.name.substring(0,10)} has dropped to ${price}!`,
            },
            data: {
               image:product.photos[0]
            },
          };
          //first get the user fcm token
          const user_id:string = product.user_id;
          const user = await userService.getUserById(user_id);
          const fcm_token:string|undefined|null = user?.fcm_token;
          
          const message ={
            payload : payload,
            fcm_token :fcm_token
          }


          //send the message
          const channel = await createChannel();
          await publishMessage(
            channel,
            env.NOTIFICATION_BINDING_KEY,
            message,
          );
        }
        //updating the price of the product
        const update = await productService.updatePriceOfProduct(
          product.id,
          priceArray
        );
        console.log(update);
      }
    });
  } catch (error) {
    console.log(error);
  }
});
