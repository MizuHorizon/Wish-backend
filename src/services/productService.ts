import { IProduct } from "../interface/utilInterface";
import prisma from "../prisma/index";
const { product } = prisma;

class ProductService {
        async createProduct(productData:IProduct){
            try {
                const _product = await product.create({
                    data : {
                        name:productData.name,
                        url:productData.url,
                        photos:productData.photos,
                        description:productData.description,
                        start_price:productData.start_price,
                        desired_price:productData.desired_price,
                        prices:productData.prices,
                        user_id:productData.user_id,
                        trackable:productData.trackable,
                    }
                });
                return _product;
            } catch (error) {
                console.log(error);
                throw error;
            }
        }

        async getProductbyId(id:string){
            try {
                const _product = await product.findUnique({
                    where : {
                        id :id
                    }
                });
                return _product;
            } catch (error) {
                console.log(error);
                throw error;
            }
        }
        async getProductbyIdOfUser(user_id:string){
            try {
                const _products = await product.findUnique({
                    where : {
                        id :user_id
                    }
                });
                return _products;
            } catch (error) {
                console.log(error);
                throw error;
            }
        }
        async getTrackableProductbyIdOfUser(user_id:string){
            try {
                const _products = await product.findUnique({
                    where : {
                        id :user_id,trackable:true
                    }
                });
                return _products;
            } catch (error) {
                console.log(error);
                throw error;
            }
        }

        async updatePriceOfProduct(productId:string,price : any){
            try {
                console.log(price);
                const prd = await product.findUnique({
                    where : {
                        id : productId
                    }
                });
                let priceArray = prd?.prices;
                priceArray?.push(price); 
                const _product = await product.update({
                    where :{
                        id : productId
                    },
                    data : {
                        prices :price
                    }
                })
                return _product;
            } catch (error) {
                console.log(error);
                throw error;
            }
        }

        async deleteProduct(productId:string){
            try {
                const _product = await product.delete({
                    where : {
                        id : productId
                    }
                });
                return _product;
            } catch (error) {
                console.log(error);
                throw error;
            }
        }
}

export default ProductService;