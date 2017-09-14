'use strict';

const puppeteer = require('puppeteer');

(async() => {
const from = process.argv[2];
const to = process.argv[3];
const start_date = process.argv[4];
const return_date = process.argv[5];
const browser = await puppeteer.launch();

const page = await browser.newPage();
await page.goto(`https://tp24.airtickets.com/results#search/${from}/${to}/obDate/${start_date}/ibDate/${return_date}/isRoundtrip/1/passengersAdult/1/passengersChild/0/passengersInfant/0/directFlightsOnly/0/extendedDates/0`, {
  waitUntil: 'networkidle'});
// Type our query into the search bar
// Wait for the results to show up
await page.screenshot({path: 'example2.png'});
// await page.waitForSelector('#fqs-info');
// Extract the results from the page
const data = await page.evaluate(() => {
  console.log(document)
  const results = Array.from(document.querySelector("#results-container").children);
  return results.map((r)=>{
    const times = r.querySelectorAll('.time')
    const infos = r.querySelectorAll('.connection-info span')

    return {
      fromDepartureTime: times[0].textContent.trim(),
      fromArrivalTime: times[1].textContent.trim(),
      toDepartureTime: times[2].textContent.trim(),
      toArrivalTime: times[3].textContent.trim(),
      price: r.querySelector(".result-widget-price").textContent,
      fromCompany: infos[1].textContent.trim(),
      toCompany: infos[5].textContent.trim(),
      fromDate: infos[2].textContent.trim(),
      toDate: infos[6].textContent.trim()
    }
  })
});
console.log(JSON.stringify(data));

browser.close();

})();
