/* eslint-disable no-unused-expressions */

const expect = require('chai').expect;
const Stock = require('../lib/stock');

describe('stock', () => {
  describe('constructor', () => {
    it('should create a stock object', () => {
      const s1 = new Stock('appl');
      expect(s1.symbol).to.equal('APPL');
    });
  });
  describe('#purchase', () => {
    it('should purchase stock', (done) => {
      const s1 = new Stock('aapl');
      s1.purchase(50, (err, totalPaid) => {
        expect(err).to.be.null;
        expect(totalPaid).to.be.above(0);
        expect(s1.shares).to.equal(50);
        expect(s1.name).to.have.length.above(0);
        expect(s1.purchasePricePerShare).to.be.above(0);
        done();
      });
    });
  });
  describe('#sell', () => {
    it('should sell stock', (done) => {
      const s1 = new Stock('aapl');
      s1.shares = 50;
      s1.sell(50, (err, totalIncome) => {
        expect(err).to.be.null;
        expect(s1.shares).to.equal(0);
        expect(totalIncome).to.be.least(0);
        done();
      });
    });
  });
});
