import { CronJob } from 'cron';
import ProductService from '../../services/productService';
const productService = new ProductService();
import PriceTracker from "../../jobs/scrapper/priceTracker"; 
const tracker = new PriceTracker();
export const job = new CronJob('*/5 * * * *', async function() {
    // Your task to be executed every minute goes here
    console.log('Running a task every 5th minute!');

    const products = await productService.getAllProduct();
    // console.log(products);
    products.forEach(async (product)=>{
          if(product.trackable){
                let priceArray = product.prices;
                    if(product.company === "amazon"){
                        const price:number = await tracker.getFromAmazon(product.url);
                        priceArray.push(price);

                    }
                    if(product.company === "ajio"){
                        const price:number = await tracker.getFromAjio(product.url);
                        priceArray.push(price);
                    }
                    if(product.company === "flipkart"){
                        const price:number = await tracker.getFromFlipKart(product.url);
                        priceArray.push(price);
                    }
                    if(product.company === "myntra"){
                        const price:number = await tracker.getFromMyntra(product.url);
                        priceArray.push(price);
                    }

                //updating the price of the product 
               const update = await productService.updatePriceOfProduct(product.id,priceArray);
               console.log(update);
          }  
    });
  });
