//Script that will trigger our headless browser to take a screenshot of a website of our choice
//A headless browser is a web browser without a graphical user interface.

//import the Puppeteer library in your script
const puppeteer = require ('puppeteer');

//take the URL from command-line arguments
const url = process.args[2];
if (!url) {
    throw "Please enter URL as the first segment"
};

async function run () {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    await page.screenshot({path: 'newscreenshot.png'});
    browser.close();
}
run();
