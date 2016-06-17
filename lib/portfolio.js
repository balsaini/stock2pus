/* eslint-disable func-names */

function Portfolio(name) {
  this.name = name;
  this.stocks = [];
}

Portfolio.prototype.addStock = function (newStock) {
  this.stocks.push(newStock);
};

Portfolio.prototype.position = function () {
  const stockArray = this.stocks;

  return stockArray.reduce((acc, n) => acc + (n.shares * n.purchasePricePerShare), 0);
};

module.exports = Portfolio;
