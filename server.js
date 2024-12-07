// define the web scraper

const cheerio = require("cheerio");

let stockTicker = "pypl";
let type = "history";

async function scrapeData(ticker) {
  try {
    //fetch page html
    const url = `https://finance.yahoo.com/quote/${ticker}/${type}?p=${ticker}`;
    const response = await fetch(url);
    const html = await response.text();

    const $ = cheerio.load(html);
    const price_history = getPrices($);
    console.log(price_history);
    return price_history;
  } catch (err) {
    console.log(err.message);
  }
}

function getPrices(cheer) {
  const prices = cheer("td:nth-child(6)")
    .get()
    .map((current_value) => {
      return cheer(current_value).text();
    });
  return prices;
}

// initialize the server
const express = require("express");
const app = express();
const port = 8383;

// middleware
app.use(express.json());
app.use(require("cors")());
app.use(express.static("public"));

// define api endpoints for stock data
app.post("/api", async (req, res) => {
  const { stock_ticker: ticker } = req.body;
  console.log(ticker);
  const prices = await scrapeData(ticker);
  res.status(200).send({ prices });
});

app.listen(port, () => {
  console.log(`Server started on port: ${port}`);
});
