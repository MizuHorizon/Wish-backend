import { Request,Response } from "express";
import ScrapeProductDetails from "../jobs/scrapper/scrape";

const scrapper = new ScrapeProductDetails();


export const getProductDetails = async (req:Request,res:Response,next:any)=>{
      
      const url = req.body.url.toString();
      const match = url.match(/https?:\/\/(?:www\.)?([a-zA-Z0-9-]+)\.[a-zA-Z]+/);
      const organizationName = match ? match[1] : null;
      if(organizationName.trim()==="amazon"){
         const amazonData = await scrapper.getFromAmazon(url);
         req.body.name = amazonData.name;
         req.body.price = amazonData.price;
         req.body.photos = amazonData.photo;
         
      }
      if(organizationName.trim() ==="myntra"){
             
      }
      next();
}

