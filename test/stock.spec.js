/* eslint-disable no-unused-expressions */

const expect = require('chai').expect;
const Stock = require('../lib/stock');
const nock = require('nock');

describe('Stock', () => {
  beforeEach(() => {
    nock('http://dev.markitondemand.com')
    .get('/MODApis/Api/v2/Quote/json?symbol=AAPL')
    .reply(200, {
      Name: 'Apple',
      LastPrice: 100,
    });
  });
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
        expect(s1.name).to.equal('Apple');
        expect(totalPaid).to.equal(5000);
        expect(s1.shares).to.equal(50);
        expect(s1.name).to.have.length.above(0);
        expect(s1.purchasePricePerShare).to.equal(100);
        // expect(s1.purchaseDate.getTime()).to.equal(123);
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
    // describe('#sell', () => {
    //   it('should not sell stock', (done) => {
    //     const s1 = new Stock('aapl');
    //     // s1.shares = 50;
    //     // s1.sell(50, (err, totalIncome) => {
    //     //   expect(err).to.be.null;
    //     //   expect(s1.shares).to.equal(0);
    //     //   expect(totalIncome).to.be.least(0);
    //     //   done();
    //     });
    //   });
  });
});
