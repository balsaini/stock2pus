/* eslint-disable func-names */

const request = require('request');

function Stock(symbol) {
  this.symbol = symbol.toUpperCase();
}

Stock.prototype.purchase = function (quantity, cb) {
  const uri = `http://dev.markitondemand.com/MODApis/Api/v2/Quote/json?symbol=${this.symbol}`;
  request.get({ uri, json: true }, (err, rsp, body) => {
    this.name = body.Name;
    this.purchasePricePerShare = body.LastPrice;
    this.shares = quantity;
    const totalPaid = this.shares * this.purchasePricePerShare;
    this.purchaseDate = new Date();
    cb(null, totalPaid);
  });
};

Stock.prototype.sell = function (quantity, cb) {
  const uri = `http://dev.markitondemand.com/MODApis/Api/v2/Quote/json?symbol=${this.symbol}`;
  let totalIncome = 0;

  if (quantity > this.shares) {
    cb('Unable to sell.  Did not have enough shares to sell.', 0);
    return;
  }

  request.get({ uri, json: true }, (err, rsp, body) => {
    this.shares = this.shares - quantity;
    totalIncome = quantity * body.LastPrice;
    cb(null, totalIncome);
  });
};

module.exports = Stock;
