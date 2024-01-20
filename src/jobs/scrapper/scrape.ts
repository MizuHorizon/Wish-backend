import puppeteer from "puppeteer";

class ScrapeProductDetails {
 
  async getFromAmazon(productUrl:string) {
    const browser = await puppeteer.launch({ headless: true });

    try {
      const page = await browser.newPage();
      await page.setUserAgent(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
      );
      // Navigate the page to a URL
      await page.goto(productUrl);
      await page.waitForTimeout(2000);
      let price = await page.$eval(".a-price-whole", (element) => {
        return element!.textContent!.trim();
      });
      price = price.replace(/,/g, '');
      console.log("price", price);

      const productTitle = await page.$eval("#productTitle", (element) => {
        return element!.textContent!.trim();
      });

      console.log("Product Title:", productTitle);
      await page.waitForTimeout(2000);

      await page.waitForSelector("#imgTagWrapperId img.a-dynamic-image");
      const imageLinks = await page.$$eval(
        "#imgTagWrapperId img.a-dynamic-image",
        (images) => {
          console.log(images);
          return images.map((img) => img.getAttribute("src"));
        }
      );
      console.log("images", imageLinks);

      // Get the src attribute from the img element
      const amazonData = {
        name: productTitle,
        price: price,
        photo: imageLinks,
      };
      return amazonData;
    } catch (error) {
      console.log(error);
      throw error;
    } finally {
      //await page.waitForTimeout(2000);
      await browser.close();
    }
  }

  async getFromMyntra(productUrl : string) {
    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });

    try {
      const page = await browser.newPage();
      await page.setUserAgent(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
      );
      // Navigate the page to a URL
      await page.goto(productUrl);
      await page.waitForTimeout(2000);
      console.log(await page.content());
     
      const myntraData = {
        name: "",
        price: "",
        photo: "",
      };
      return myntraData;
    } catch (error) {
      console.log(error);
      throw error;
    } finally {
      //await page.waitForTimeout(2000);
      await browser.close();
    }
  }
}

export default ScrapeProductDetails;

const x = new ScrapeProductDetails();
x.getFromMyntra("https://www.myntra.com/sweatshirts/h%26m/hm-men-loose-fit-round-neck-sweatshirts/26789752/buy");
