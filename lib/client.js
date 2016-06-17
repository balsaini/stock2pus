/* eslint-disable func-names */
const Stock = require('../lib/stock');
const Portfolio = require('../lib/portfolio');

function Client(name) {
  this.name = name;
  this.portfolios = [];
  this.cash = 0;
}

Client.prototype.deposit = function (money) {
  this.cash += money;
};

Client.prototype.withdraw = function (money) {
  if (this.cash >= money) {
    this.cash -= money;
  }
};

Client.prototype.purchaseStock = function (symbol, qty, port, cb) {
  Stock.getQuote(symbol, (err, thePrice) => {
    const expectedPrice = qty * thePrice;

    if (err) {
      cb(err);
    }

    if (this.cash < expectedPrice) {
      cb(new Error('Not enough cash to complete purchase'));
      return;
    }

    const newStock = new Stock(symbol);
    newStock.purchase(qty, (err2, totalPaid) => {
      this.cash -= totalPaid;

      const resultingPortfolios = this.portfolios.filter((n) => n.name === port);

      let workingPortfolio;

      if (resultingPortfolios.length === 0) {
        workingPortfolio = new Portfolio(port);
        this.portfolios.push(workingPortfolio);
      } else if (resultingPortfolios.length === 1) {
        workingPortfolio = resultingPortfolios[0];
      } else {
        cb(new Error('Critical failure - To many portfolios of same name'));
        return;
      }

      workingPortfolio.addStock(newStock);

      cb(null);
    });
  });
};

Client.prototype.sellStock = function (symbol, qty, port, cb) {
  const resultingPortfolios = this.portfolios.filter((n) => n.name === port);
  const upperedSymbol = symbol.toUpperCase();

  if (resultingPortfolios.length === 0) {
    cb(new Error('No portfolio named --', port));
    return;
  }

  if (resultingPortfolios.length > 1) {
    cb(new Error('Critical failure - To many portfolios of same name'));
    return;
  }

  const workingPortfolio = resultingPortfolios[0];

  const resultingStocks = workingPortfolio.stocks.filter((n) => n.symbol === upperedSymbol);

  let amountToSell = qty;
  let i = 0;
  const toSlice = [];
  while (amountToSell > 0 || i === resultingStocks.length) {
    if (resultingStocks[i].shares >= amountToSell) {
      resultingStocks[i].sell(amountToSell, (err, income) => {
        if (err) {
          cb(err);
          return;
        }
        this.cash += income;
        for (const thingToSlice of toSlice) {
          resultingStocks.slice(thingToSlice, 1);
        }
        cb(null);
        return;
      });
      amountToSell = 0;
    } else {
      amountToSell -= resultingStocks[i].shares;
      resultingStocks[i].sell(resultingStocks[i].shares, (err, income) => {
        if (err) {
          cb(err);
          return;
        }
        this.cash += income;
      });
      toSlice.push(i);
      i++;
    }
  } // End of While Loop
};

module.exports = Client;
