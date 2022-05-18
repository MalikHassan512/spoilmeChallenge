const functions = require("firebase-functions");
const puppeteer = require(`puppeteer`);
const fs = require(`fs`);
const email = `alyrehman008@gmail.com`; // You Should Change
const password = `capandkinnu`; // You should change
const profileLink = `https://www.facebook.com/people/Ali-Rehman/100078883282837/`; // You should change
var numberofpostsMaximumgonnascrape = 50; // You can change
// const bodyParser = require('body-parser')

// app.use(bodyParser.urlencoded({
//   extended: true
// }));
// app.use(bodyParser.json());
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.userAdded = functions.auth.user().onCreate(user => {
  //console.log(user.email)
  (async () => {
    const browser = await puppeteer.launch({
      headless: false,
      args: [`--no-sandbox`, `--start-maximized`]
    }); // if headless is true , Chrome won't open , if headless is false , Chrome will open . Should be true**
    const page = await browser.newPage();
    await page.goto(`https://www.facebook.com/login/`);
    await page.waitForSelector(`input[name="email"]`);
    await console.log(`Facebook > Login Page Opened .`);
    let emailselector = await page.$$(`input[name="email"]`);
    await emailselector[0].click();
    await page.keyboard.type(`${email}`);
    await console.log(`Facebook > Email Typed .`);
    let passwordselector = await page.$$(`input[name="pass"]`);
    await passwordselector[0].click();
    await page.keyboard.type(`${password}`);
    await console.log(`Facebook > Password Typed .`);
    let loginbutton = await page.$$(`button[name="login"]`);
    await loginbutton[0].click();
    await console.log(`Facebook > Login Button Clicked .`);
    await page.waitForNavigation();
    await console.log(`Facebook > Login Succesful .`);
    await PickAccount(browser, page);
  })();
  async function PickAccount(browser, page) {
    await page.goto(profileLink);
    await console.log(`Facebook > Profile Opened .`);
    await page.waitForSelector(`div[data-pagelet="ProfileTimeline"]`);
    await console.log(`Facebook > Finding The Public Posts .`);
    let usernameorid = ``;
    if (profileLink.includes(`profile.php`)) {
      usernameorid = `${profileLink.slice(profileLink.search(`id=`) + 3).split(`&`)[0]}`;
    } else {
      usernameorid = `${profileLink.slice(profileLink.search(`.com/`) + 5).split(`?`)[0].split(/[\W_]+/g).join(``)}`;
    };
    await ScrollDown(browser, page, 0, usernameorid);
  };
  async function ScrollDown(browser, page, sayi, usernameorid) {
    await console.log(`Facebook > Scrolling Down...`);
    if (sayi < Math.floor(numberofpostsMaximumgonnascrape / 5)) {
      setTimeout(async () => {
        await page.evaluate(() => {
          window.scrollBy(0, 99999999);
        });
        await ScrollDown(browser, page, sayi + 1, usernameorid)
      }, 1000);
    } else {
      await StartTheScrape(browser, page, usernameorid);
    };
  };
  async function StartTheScrape(browser, page, usernameorid) {
    let childrensuan = await page.evaluateHandle(() => {
      if (document.querySelectorAll(`div[data-pagelet="ProfileTimeline"]`)[0].childElementCount == 0) {
        return `Yok`;
      } else {
        return Array.from(document.querySelectorAll(`div[data-pagelet="ProfileTimeline"]`)[0].children).map(map => `${map.innerHTML}`).join(`\n--------------------------------------------- New Post -------------------------------------------------\n`);
      }
    });
    if (childrensuan == `Yok`) {
      await console.log(`Facebook > ${numberofaccountsscraped + 1}. Doesn't have public posts .`);
      await console.log(`Facebook > Changing Random Account`);
      await console.log(`Waiting 5 Seconds to complete...`);
      setTimeout(async () => {
        await browser.close();
      }, 5000);
      return;
    }
    childrensuan._remoteObject.value.search("Got engaged") > 0 ? console.log("Got engaged",true) : console.log("Got engaged",false);
    fs.writeFile(`./Scrapes/${usernameorid}.html`, childrensuan._remoteObject.value, async (err) => {
      // childrensuan._remoteObject.value console this value and check html. i think you will parse this variable
      await console.log(`Mission Completed .`);
      await console.log(`Waiting 5 Seconds to complete...`);
      setTimeout(async () => {
        await browser.close();
      }, 5000);
    });
  };
  return Promise.resolve()
});


exports.sendSpoil = functions.https.onRequest((req, res) => {
    console.log("reqqq",req.body)
});