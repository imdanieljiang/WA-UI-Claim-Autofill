// Secrets
require("dotenv").config();

// Selenium
const { Builder, By, Key, until } = require("selenium-webdriver");
const readline = require("readline");

let driver = new Builder().forBrowser("chrome").build();
driver.get("https://secure.esd.wa.gov/home/");

async function login() {
  let onClaimsPage = false;

  do {
    await driver.wait(until.elementLocated(By.id("username")));
    await driver.wait(until.elementLocated(By.id("password")));
    await driver.findElement(By.id("username")).sendKeys(process.env.USERNAME);
    await driver
      .findElement(By.id("password"))
      .sendKeys(process.env.PASSWORD, Key.RETURN);

    refreshUntilLoginSuccessful();

    // Authentication
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    // User clicks on browser via email/phone number
    // Enter authentication code into console
    const authCode = await new Promise((resolve) => {
      rl.question("Enter the authentication code: ", (code) => {
        rl.close();
        resolve(code);
      });
    });

    await driver.wait(until.elementLocated(By.id("otp-input")));
    await driver.findElement(By.id("otp-input")).sendKeys(authCode, Key.RETURN);

    // await driver.wait(
    //   until.elementLocated(By.css("input.button[type='Submit']"))
    // );
    await driver.findElement(By.css("input.button[type='Submit']")).click();

    try {
      // await driver.wait(
      //   until.elementLocated(By.xpath("//button[.//span[text()='Yes']]"))
      // );
      // await driver
      //   .findElement(By.xpath("//button[.//span[text()='Yes']]"))
      //   .click();
      await driver
        .findElement(By.xpath("/html/body/div[6]/div[3]/div/button[1]/span"))
        .click();

      await driver.wait(
        until.elementLocated(By.xpath("//*[@id='l_c-5-1']/span/span/span"))
      );
      await driver
        .findElement(By.xpath("//*[@id='l_c-5-1']/span/span/span"))
        .click();

      onClaimsPage = true;
    } catch (error) {
      onClaimsPage = false;
    }
  } while (!onClaimsPage);
}

// Login errors occasionally occur, this refreshes
// the page until the desired page is loaded
async function refreshUntilLoginSuccessful() {
  const claimsPageLinkText =
    "Apply for unemployment benefits or manage your current and past claims";
  let elementFound = false;

  do {
    await driver.navigate().refresh();
    await driver.wait(
      until.elementLocated(By.linkText(claimsPageLinkText)),
      3000
    );

    try {
      await driver.findElement(By.linkText(claimsPageLinkText)).click();
      elementFound = true;
    } catch (error) {
      elementFound = false;
    }
  } while (!elementFound);
}

login();

// async function refreshUntilLoginSuccessful() {
//   const claimsPageLinkText =
//     "Apply for unemployment benefits or manage your current and past claims";
//   let elementFound = false;

//   // Login error occasionally occurs
//   // Refreshes the page until desired page is loaded
//   do {
//     await driver.navigate().refresh();
//     await driver.wait(
//       until.elementLocated(By.linkText(claimsPageLinkText)),
//       3000
//     );

//     try {
//       await driver.findElement(By.linkText(claimsPageLinkText)).click();
//       elementFound = true;
//     } catch (error) {
//       elementFound = false;
//     }
//   } while (!elementFound);
// }

// async function login() {
//   let onClaimsPage = false;

//   do {
//     await driver.findElement(By.id("username")).sendKeys(process.env.USERNAME);
//     await driver
//       .findElement(By.id("password"))
//       .sendKeys(process.env.PASSWORD, Key.RETURN);

//     refreshUntilLoginSuccessful();

//     // Multi-factor authentication
//     const rl = readline.createInterface({
//       input: process.stdin,
//       output: process.stdout
//     });

//     // Enter authentication code into console (user picks on page whether to use email/phone number verification)
//     const authCode = await new Promise((resolve) => {
//       rl.question("Enter the authentication code: ", (code) => {
//         rl.close();
//         resolve(code);
//       });
//     });

//     await driver.findElement(By.id("otp-input")).sendKeys(authCode, Key.RETURN);
//     await driver.findElement(By.css("input.button[type='Submit']")).click();

//     try {
//       await driver
//         .findElement(By.xpath("//button[.//span[text()='Yes']]"))
//         .click();
//       onClaimsPage = true;
//     } catch (error) {
//       onClaimsPage = false;
//     }
//   } while (!onClaimsPage);

//   const weeklyClaimText = "You have a UI weekly claim to file";
//   await driver.findElement(By.linkText(weeklyClaimText)).click();
// }

// async function navigateToClaim() {
//   // await driver.findElement(By.className("ColIconText")).click();
// }

// async function handleClaim() {
//   const element = await driver.findElement(By.id("caption2_m-3"));
//   const text = await element.getText;
//   console.log(text);
// }

// // function main() {
// //   login();
// //   navigateToClaim();
// //   // handleClaim();
// // }

// // main();

// login();
