import { CronJob } from "cron";
import ProductService from "../../services/productService";
const productService = new ProductService();
import PriceTracker from "../../jobs/scrapper/priceTracker";
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
        if (product.company === "amazon") {
          try {
            const price: number = await tracker.getFromAmazon(product.url);
            priceArray.push(JSON.stringify({ price: price, date: new Date() }));
          } catch (error) {
            console.log(error);
          }
        }
        if (product.company === "ajio") {
          try {
            const price: number = await tracker.getFromAjio(product.url);
            priceArray.push(JSON.stringify({ price: price, date: new Date() }));
          } catch (error) {
            console.log(error);
          }
        }
        if (product.company === "flipkart") {
          try {
            const price: number = await tracker.getFromFlipKart(product.url);
            priceArray.push(JSON.stringify({ price: price, date: new Date() }));
          } catch (error) {
            console.log(error);
          }
        }
        if (product.company === "myntra") {
          try {
            const price: number = await tracker.getFromMyntra(product.url);
            priceArray.push(JSON.stringify({ price: price, date: new Date() }));
          } catch (error) {
            console.log(error);
          }
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
