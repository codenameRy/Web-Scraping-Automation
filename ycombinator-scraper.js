//Phase 1 - Display content from page 1
/*Puppeteer Evaluate Method - This method lets us run custom JavaScript code as if we were executing it in the 
DevTools console. Anything returned from that function gets resolved by the promise. This method is very handy
when it comes to scraping information or performing custom actions.

Array
code passed to the evaluate() method is pretty basic JavaScript that builds an array of objects, each having 
url and text fields that represent the story URLs we see on https://news.ycombinator.com/.

*/
const puppeteer = require('puppeteer');

function run() {
    return new Promise(async (resolve, reject) => {
        try {
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            await page.goto('https://news.ycombinator.com/');
            let urls = await page.evaluate(() => {
                let results = [];
                let items = document.querySelectorAll('a.storylink');
                items.forEach((item) => {
                    results.push({
                        url: item.getAttribute('href'),
                        text: item.innerText,
                    });
                });
                return results;
            })
            browser.close();
            return resolve(urls);
        } catch (e) {
            return reject(e);
        }
    })
}
run().then(console.log).catch(console.error);
