const expect = require('chai').expect;
const Portfolio = require('../lib/portfolio');
const Stock = require('../lib/stock');

describe('Portfolio', () => {
  describe('#constructor', () => {
    it('should create a portfolio object', () => {
      const testPort = new Portfolio('Tech');

      expect(testPort.name).to.equal('Tech');
      expect(testPort.stocks).to.have.length(0);
    });
  });
  describe('#addStock', () => {
    it('should add a stock to the portfolio', () => {
      const testPort = new Portfolio('Tech');
      testPort.addStock({ name: 'Hooray', shares: 10 });
      testPort.addStock({ name: 'Hello', shares: 5 });
      expect(testPort.stocks).to.have.length(2);
    });
  });
  describe('#position', () => {
    it('should determine and report the position of the portfolio', () => {
      const testPort = new Portfolio('EDMS');

      const s1 = new Stock('silly');
      s1.shares = 5;
      s1.purchasePricePerShare = 1;

      const s2 = new Stock('test');
      s2.shares = 10;
      s2.purchasePricePerShare = 2;

      testPort.addStock(s1);
      testPort.addStock(s2);

      const firstTestResult = testPort.position();
      testPort.stocks[0].shares = 0;
      const secondTestResult = testPort.position();

      expect(firstTestResult).to.equal(25);
      expect(secondTestResult).to.equal(20);
    });
  });
});
