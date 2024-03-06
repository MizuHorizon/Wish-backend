import { CronJob } from "cron";
import ProductService from "../../services/productService";
const productService = new ProductService();
import PriceTracker from "../../jobs/scrapper/priceTracker";
import { createChannel, publishMessage } from "../../services/queueService";
import env from "../../config/serverConfig";
const tracker = new PriceTracker();



export const job = new CronJob("0 * * * *", async function () {
  // Your task to be executed every minute goes here
  console.log("Running a task every hour!");

  const products = await productService.getAllProduct();
  // console.log(products);
  try {
    products.forEach(async (product) => {
      if (product.trackable == true) {
        let priceArray = product.prices;
        let price:number = -1;
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
        console.log(price);
        //send it to the queue to send notifications
        

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
