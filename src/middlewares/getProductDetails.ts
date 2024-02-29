
import ScrapeProductDetails from "../jobs/scrapper/scrape";
import { IScrapredProduct } from "../interface/utilInterface";

const scrapper = new ScrapeProductDetails();

export const getProductDetails = async (
 url : string,
 productTags : Array<string>|undefined
) => {


  const match = url.match(/https?:\/\/(?:www\.)?([a-zA-Z0-9-]+)\.[a-zA-Z]+/);
  const organizationName = (match ? match[1] : null) as string ;
  
  if(!productTags){
     productTags = [];
  }

  if(!Array.isArray(productTags) && productTags){
      let tag = productTags;
      productTags = [];
      productTags.push(tag);
  }
  let scrapeProd :IScrapredProduct = {
    name:"",
    price :"",
    photos : "",
    currencySymbol:"",
    tags:[],
    org:""
  };

  console.log(organizationName);
  scrapeProd.org = organizationName as string;

  try{
  if (organizationName.trim() === "amazon") {
    const amazonData = await scrapper.getFromAmazon(url);
    scrapeProd.name = amazonData.name;
    scrapeProd.price = amazonData.price;
    scrapeProd.photos = amazonData.photo as [] ;
    scrapeProd.currencySymbol = amazonData.currencySymbol;
    productTags.push("amazon");

    
  } else if (organizationName.trim() === "myntra") {
    const myntraData = await scrapper.getFromMyntra(url);
    scrapeProd.name = myntraData.name;
    scrapeProd.price = myntraData.price;
    scrapeProd.photos = myntraData.photo as [];
    scrapeProd.currencySymbol = myntraData.currencySymbol;
    productTags.push("myntra");
  } else if (organizationName.trim() === "flipkart") {
    const flipkartData = await scrapper.getFromFlipkart(url);
    scrapeProd.name = flipkartData.name;
    scrapeProd.price = flipkartData.price;
    scrapeProd.photos = flipkartData.photo as [];
    scrapeProd.currencySymbol = flipkartData.currencySymbol;
    productTags.push("flipkart");
  } else if(organizationName.trim()==="ajio"){
      const ajioData = await scrapper.getFromAjio(url);
      scrapeProd.name = ajioData.name;
      scrapeProd.price = ajioData.price;
      scrapeProd.photos = ajioData.photo as [];
      scrapeProd.currencySymbol = ajioData.currencySymbol;
      productTags.push("ajio");
  }
  scrapeProd.tags = productTags as [];
  return scrapeProd;

} catch(error){
  console.log(error);
  throw error;
}
};
