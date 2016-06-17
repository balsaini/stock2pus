/* eslint-disable no-unused-expressions */

const expect = require('chai').expect;
const Stock = require('../lib/stock');
const nock = require('nock');
const sinon = require('sinon');
let clock;

describe('Stock', () => {
  beforeEach(() => {
    nock('http://dev.markitondemand.com')
    .get('/MODApis/Api/v2/Quote/json?symbol=AAPL')
    .reply(200, {
      Name: 'Apple',
      LastPrice: 100,
    });
    clock = sinon.useFakeTimers();
  });
  after(() => {
    clock.restore();
    nock.restore();
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
      clock.tick(1234567890123);
      s1.purchase(50, (err, totalPaid) => {
        expect(err).to.be.null;
        expect(s1.name).to.equal('Apple');
        expect(totalPaid).to.equal(5000);
        expect(s1.shares).to.equal(50);
        expect(s1.name).to.have.length.above(0);
        expect(s1.purchasePricePerShare).to.equal(100);
        expect(s1.purchaseDate.getTime()).to.equal(1234567890123);
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
        expect(totalIncome).to.equal(5000);
        done();
      });
    });
    describe('#sell', () => {
      it('should not sell stock', (done) => {
        const s1 = new Stock('aapl');
        s1.shares = 50;
        s1.sell(100, (err, totalIncome) => {
          expect(err).to.equal('Unable to sell.  Did not have enough shares to sell.');
          expect(s1.shares).to.equal(50);
          expect(totalIncome).to.equal(0);
          done();
        });
      });
    });
  });
});
