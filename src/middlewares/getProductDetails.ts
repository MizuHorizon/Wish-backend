import { Request, Response } from "express";
import ScrapeProductDetails from "../jobs/scrapper/scrape";

const scrapper = new ScrapeProductDetails();

export const getProductDetails = async (
  req: Request,
  res: Response,
  next: any
) => {
  const url = req.body.url.toString();
  const match = url.match(/https?:\/\/(?:www\.)?([a-zA-Z0-9-]+)\.[a-zA-Z]+/);
  const organizationName = match ? match[1] : null;
  
  if(!req.body.tags){
    req.body.tags = [];
  }

  if(!Array.isArray(req.body.tags) && req.body.tags){
      let tag = req.body.tags;
      req.body.tags = [];
      req.body.tags.push(tag);
  }


  console.log(organizationName);
  req.body.company = organizationName;
  if (organizationName.trim() === "amazon") {
    const amazonData = await scrapper.getFromAmazon(url);
    req.body.name = amazonData.name;
    req.body.price = amazonData.price;
    req.body.photos = amazonData.photo;
    req.body.currencySymbol = amazonData.currencySymbol;
    req.body.tags.push("amazon");
    
  } else if (organizationName.trim() === "myntra") {
    const myntraData = await scrapper.getFromMyntra(url);
    req.body.name = myntraData.name;
    req.body.price = myntraData.price;
    req.body.photos = myntraData.photo;
    req.body.currencySymbol = myntraData.currencySymbol;
    req.body.tags.push("myntra");
  } else if (organizationName.trim() === "flipkart") {
    const flipkartData = await scrapper.getFromFlipkart(url);
    req.body.name = flipkartData.name;
    req.body.price = flipkartData.price;
    req.body.photos = flipkartData.photo;
    req.body.currencySymbol = flipkartData.currencySymbol;
    req.body.tags.push("flipkart");
  } else if(organizationName.trim()==="ajio"){
      const ajioData = await scrapper.getFromAjio(url);
      req.body.name = ajioData.name;
      req.body.price = ajioData.price;
      req.body.photos = ajioData.photo;
      req.body.currencySymbol = ajioData.currencySymbol;
      req.body.tags.push("ajio");
  }else {
    return res.status(404).json({
      message: "Company not supported!",
      success: false,
    });
  }
  next();
};
