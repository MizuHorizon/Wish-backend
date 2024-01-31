import { CronJob } from 'cron';
import ProductService from '../../services/productService';
const product = new ProductService();


export const job = new CronJob('* * * * *', async function() {
    // Your task to be executed every minute goes here
    console.log('Running a task every minute!');

    // const products = await product.getAllProduct();
    // console.log(products);
    // products.forEach((product)=>{
            
    // });
  });
