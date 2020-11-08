const puppeteer = require('puppeteer');

function run(pagesToScrape) {
    return new Promise(async (resolve, reject) => {
        try {
            if (!pagesToScrape) {
                pagesTopScrape = 1;
            }
            const browser = await puppeteer.launch();
            const page = await browser.newPage();

            /*interceptor on every request and cancel the ones we don’t really need.
            we only allow requests with the resource type of "document" to get through 
            our filter, meaning that we will block all images, CSS, and everything else 
            besides the original HTML response.
            */
            await page.setRequestInterception(true);
            page.on('request', (request) => {
                if (request.resourceType() === 'document') {
                    request.continue();
                } else {
                    request.abort();
                }
            });

            await page.goto('https://news.ycombinator.com/');
            let currentPage = 1;
            let urls = [];
            while (currentPage <= pagesToScrape) {
                let newURLs = await page.evaluate(() => {
                    let results = [];
                    let items = document.querySelectorAll('a.storylink');
                    items.forEach((item) => {
                        results.push({
                            url: item.getAttribute('href'),
                            text: item.innerText,
                        });
                    });
                    return results;
                });
                urls = urls.concat(newURLs);
                if (currentPage > pagesToScrape) {
                    await Promise.all([
                        await page.click('a.morelink'),
                        await page.waitForSelector('a.storylink')
                    ])
                }
                currentPage++;
            }
            browser.close();
            return resolve(urls);
        } catch (e) {
            return reject(e);
        }
    })
}

run(5).then(console.log).catch(console.error);