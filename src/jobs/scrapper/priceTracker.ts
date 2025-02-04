import puppeteer from "puppeteer";

class PriceTracker {
  async getFromAmazon(url: string) {
    const browser = await puppeteer.launch({ 
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    try {
      const page = await browser.newPage();
      await page.setUserAgent(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
      );
      // Navigate the page to a URL
      await page.goto(url, { timeout: 60000 });
      await page.waitForTimeout(2000);
      let price = await page.$eval(".a-price-whole", (element) => {
        return element!.textContent!.trim();
      });
      price = price.replace(/,/g, "");
      console.log("price", price);
      return Number(price);
    } catch (error) {
      console.log(error);
      throw error;
    } finally {
      //await page.waitForTimeout(2000);
      await browser.close();
    }
  }
  extractPrice(price:string){
    let res = "";
    for(let c of price){
     if (c >= '0' && c <= '9') {
       res += c;
    }
 }
 return Number(res);
}
  async getFromFlipKart(url: string) {
    const browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });
      try {
        const page = await browser.newPage();
        await page.setUserAgent(
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        );
        // Navigate the page to a URL
        await page.goto(url, { timeout: 60000 });
        await page.waitForTimeout(2000);
        await page.waitForSelector("._30jeq3._16Jk6d");
        const productPrice = await page.$eval("._30jeq3._16Jk6d", (element) => {
          return element!.textContent!.trim();
        });
        console.log(productPrice);
        return this.extractPrice(productPrice);
      } catch (error) {
        console.log(error);
        throw error;
      } finally {
        //await page.waitForTimeout(2000);
        await browser.close();
      }
  }
  async getFromMyntra(url: string) {
    const browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });
  
      try {
        const page = await browser.newPage();
        await page.setUserAgent(
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        );
        // Navigate the page to a URL
        await page.goto(url, { timeout: 60000 });
        await page.waitForTimeout(2000);
  
        const priceElement = await page.$(".pdp-price strong");
        const priceText = await page.evaluate(
          (element) => element!.textContent,
          priceElement
        );
        console.log("price", priceText);
        // console.log('Style attribute value:', photos);
        let price: number;
        if (priceText?.includes("₹")) {
          price = Number(priceText!.split("₹")[1].trim());
        } else {
          price = Number(priceText!.split(" ")[1].trim());
        }
  
        console.log(price);
        return price;
      } catch (error) {
        console.log(error);
        throw error;
      } finally {
        //await page.waitForTimeout(2000);
        await browser.close();
      }
  }
  async getFromAjio(url: string) {
    const browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });
  
      try {
        const page = await browser.newPage();
        await page.setUserAgent(
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        );
        // Navigate the page to a URL
        await page.goto(url, { timeout: 60000 });
        await page.waitForTimeout(2000);
  
        const priceElement = await page.$(".prod-sp");
        const priceText = await page.evaluate(
          (element) => element!.textContent,
          priceElement
        );
        console.log("price", priceText);
        let price: number;
        price = Number(priceText!.split("₹")[1].split(",").join(""));
       console.log(price);
       
        console.log(price);
        return price;
      } catch (error) {
        console.log(error);
        throw error;
      } finally {
        //await page.waitForTimeout(2000);
        await browser.close();
      }
  }
  async getFromSnitch(productUrl:string){
   
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox',
     ],
    });
    try {
      const page = await browser.newPage();
      await page.setUserAgent(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
      );
      // await page.setDefaultTimeout(60000); 
      // Navigate the page to a URL
      await page.goto(productUrl, { timeout: 60000 });
      //await page.waitForNavigation({ waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(2000);
      const price:string = await page.evaluate(() => {
        const priceElement = document.querySelector('span.product__price');
        return priceElement ? priceElement.textContent!.trim() :"";
      });
    

    

  
   return Number(price.split(" ")[1].split(',').join(""));
  
  
   

    } catch (error) {
       console.error(error);
    } finally{
      await browser.close();
    }
  }


  async getFromBewakoof(productUrl: string) {
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    try {
      const page = await browser.newPage();
      await page.setUserAgent(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
      );
      // await page.setDefaultTimeout(60000);
      // Navigate the page to a URL
      await page.goto(productUrl, { timeout: 60000 });
      //await page.waitForNavigation({ waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(2000);
      const price = await page.evaluate(() => {
        const priceElement = document.querySelector(
          'span[class="sellingPrice mr-1"]'
        );
        return priceElement ? priceElement.textContent : null;
      });
      return  Number(price?.split("₹")[1]);
    } catch (error) {
      console.error(error);
    } finally {
      await browser.close();
    }
  }
  
  async getFromBonkers(productUrl: string) {
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    try {
      const page = await browser.newPage();
      await page.setUserAgent(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
      );
      // await page.setDefaultTimeout(60000);
      // Navigate the page to a URL
      await page.goto(productUrl, { timeout: 60000 });
      //await page.waitForNavigation({ waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(2000);
      const priceAmount = await page.evaluate(() => {
        const priceElement = document.querySelector('span.woocommerce-Price-amount.amount');
        return priceElement ? priceElement!.textContent!.trim() : null;
      });
      return  Number(priceAmount!.split("₹")[1].split('.')[0]);
    } catch (error) {
      console.error(error);
    } finally {
      await browser.close();
    }
  }
}
export default PriceTracker;
