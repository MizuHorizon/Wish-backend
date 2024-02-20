import puppeteer from "puppeteer";

class ScrapeProductDetails {
  async getFromAmazon(productUrl: string) {
    const browser = await puppeteer.launch({ headless: true });

    try {
      const page = await browser.newPage();
      await page.setUserAgent(
        "AppleWebKit/537.36 (KHTML, like Gecko) Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/91.0.4472.124 Safari/537.36"
      );
      await page.setViewport({ width: 1280, height: 800 });
      // Navigate the page to a URL
      await page.goto(productUrl, { timeout: 60000 });
        await page.waitForTimeout(4000); // Increase waiting time to 4 seconds

        await page.waitForSelector('.a-price-whole', { timeout: 30000 });
      let price = await page.$eval(".a-price-whole", (element) => {
        return element!.textContent!.trim();
      });
      let symbol = await page.$eval(".a-price-symbol", (element) => {
        return element!.textContent!.trim();
      });
      price = price.replace(/,/g, "");
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
        currencySymbol : symbol
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

  #extractPrice(price:string){
     let res = "";
     for(let c of price){
      if (c >= '0' && c <= '9') {
        res += c;
     }
  }
  return Number(res);
}

  async getFromFlipkart(productUrl: string) {
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
      await page.goto(productUrl, { timeout: 60000 });
      await page.waitForTimeout(2000);
      await page.waitForSelector(".B_NuCI");

      const productName = await page.$eval(".B_NuCI", (element) => {
        return element!.textContent!.trim();
      });
      await page.waitForSelector("._30jeq3._16Jk6d");
      const productPrice = await page.$eval("._30jeq3._16Jk6d", (element) => {
        return element!.textContent!.trim();
      });

      await page.waitForSelector("._396cs4._2amPTt._3qGmMb");
      const productPhoto = await page.$eval(
        "._396cs4._2amPTt._3qGmMb",
        (element) => {
          return element.getAttribute("src");
        }
      );
      // console.log(productPhoto);

      const flipkartData = {
        name: productName,
        price: this.#extractPrice(productPrice),
        photo: [productPhoto],
        currencySymbol : "₹"
      };
      console.log(flipkartData);
      return flipkartData;
    } catch (error) {
      console.log(error);
      throw error;
    } finally {
      //await page.waitForTimeout(2000);
      await browser.close();
    }
  }

  async getFromAjio(productUrl:string){
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
      await page.goto(productUrl, { timeout: 60000 });
      await page.waitForTimeout(2000);

      const priceElement = await page.$(".prod-sp");
      const priceText = await page.evaluate(
        (element) => element!.textContent,
        priceElement
      );
      console.log("price", priceText);

      const productName = await page.$eval(".prod-name", (element) => {
        return element.textContent!.trim();
      });
      await page.waitForSelector('.rilrtl-lazy-img-loaded');
      const photos = await page.$eval(".rilrtl-lazy-img-loaded", (divElement) =>
        divElement.getAttribute("src")
      );
      // console.log('Style attribute value:', photos);
      let price: number;
      price = Number(priceText!.split("₹")[1].split(",").join(""));
     console.log(price);
      const AjioData = {
        name: productName,
        price: price,
        photo: [photos],
        currencySymbol : "₹"
      };
      console.log(AjioData);
      return AjioData;
    } catch (error) {
      console.log(error);
      throw error;
    } finally {
      //await page.waitForTimeout(2000);
      await browser.close();
    }
  }

  async getFromMyntra(productUrl: string) {
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
      await page.goto(productUrl, { timeout: 60000 });
      await page.waitForTimeout(2000);

      const priceElement = await page.$(".pdp-price strong");
      const priceText = await page.evaluate(
        (element) => element!.textContent,
        priceElement
      );
      console.log("price", priceText);

      const productName = await page.$eval(".pdp-name", (element) => {
        return element.textContent!.trim();
      });

      const photos = await page.$eval(".image-grid-image", (divElement) =>
        divElement.getAttribute("style")
      );

      // console.log('Style attribute value:', photos);
      let price: number;
      if (priceText?.includes("₹")) {
        price = Number(priceText!.split("₹")[1].trim());
      } else {
        price = Number(priceText!.split(" ")[1].trim());
      }

      const myntraData = {
        name: productName,
        price: price,
        photo: [photos?.split('("')[1].split('")')[0]],
        currencySymbol : "₹"
      };
      console.log(myntraData);
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

// const x = new ScrapeProductDetails();
// x.getFromAjio(
//   "https://www.ajio.com/avaasa-mix-n-match-embellished-dupatta-with-tassels/p/443016925_gold"
// );
