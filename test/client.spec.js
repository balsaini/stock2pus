const expect = require('chai').expect;
const Client = require('../lib/client');
const nock = require('nock');

describe('Client', () => {
  before(() => {
    nock('http://dev.markitondemand.com')
    .persist()
    .get('/MODApis/Api/v2/Quote/json?symbol=AAPL')
    .reply(200, {
      Name: 'Apple',
      LastPrice: 10000,
    });

    nock('http://dev.markitondemand.com')
    .persist()
    .get('/MODApis/Api/v2/Quote/json?symbol=ALL')
    .reply(200, {
      Name: 'Allstate',
      LastPrice: 1,
    });
  });
  after(() => {
    nock.cleanAll();
  });
  describe('#constructor', () => {
    it('Should build a client object', () => {
      const testClient = new Client('Steve');
      expect(testClient.name).to.be.equal('Steve');
      expect(testClient.portfolios).to.have.length(0);
      expect(testClient.cash).to.equal(0);
    });
  });
  describe('#deposit', () => {
    it('Should deposit cash into the client', () => {
      const testClient = new Client('Tom Wilson');
      testClient.deposit(18000000);
      expect(testClient.cash).to.equal(18000000);
    });
  });
  describe('#withdraw', () => {
    it('Should withdraw cash from the client', () => {
      const testClient = new Client('Tom Wilson');
      testClient.cash = 20000000;
      testClient.withdraw(18000000);
      expect(testClient.cash).to.equal(2000000);
    });
    it('Should not overdraw cash from the client', () => {
      const testClient = new Client('Tom Wilson');
      testClient.cash = 20000000;
      testClient.withdraw(30000000);
      expect(testClient.cash).to.equal(20000000);
    });
  });
  describe('#purchaseStock', () => {
    it('Will purchase some stock in new portfolio', (done) => {
      const testClient = new Client('Tom Wilson');
      testClient.cash = 10000000;
      testClient.purchaseStock('aapl', 100, 'tech', (err) => {
        expect(err).to.be.a('null');
        expect(testClient.cash).to.equal(9000000);
        expect(testClient.portfolios).to.have.length(1);
        expect(testClient.portfolios[0].stocks).to.have.length(1);
        done();
      });
    });
    it('Will purchase some stock in existing portfolio', (done) => {
      const testClient = new Client('Tom Wilson');
      testClient.cash = 10000000;
      testClient.purchaseStock('aapl', 100, 'tech', (err) => {
        testClient.purchaseStock('aapl', 100, 'tech', (err2) => {
          expect(testClient.cash).to.equal(8000000);
          expect(testClient.portfolios).to.have.length(1);
          expect(testClient.portfolios[0].stocks).to.have.length(2);
          expect(err).to.be.a('null');
          expect(err2).to.be.a('null');
          done();
        });
      });
    });
    it('Will not purchase stock if not enough cash', (done) => {
      const testClient = new Client('Tom Wilson');
      testClient.cash = 100;

      testClient.purchaseStock('aapl', 100, 'tech', (err) => {
        expect(err).to.be.an('Error');
        expect(testClient.cash).to.equal(100);
        expect(testClient.portfolios).to.have.length(0);
        done();
      });
    });
  });
  describe('#sellStock', () => {
    it('Will sell given amount of specified stock', (done) => {
      const testClient = new Client('President Obama');
      testClient.cash = 10;
      testClient.purchaseStock('all', 4, 'tech', (err) => {
        testClient.purchaseStock('all', 4, 'tech', (err2) => {
          testClient.sellStock('all', 2, 'tech', (err3) => {
            expect(err).to.be.a('null');
            expect(err2).to.be.a('null');
            expect(err3).to.be.a('null');
            expect(testClient.cash).to.equal(4);
            expect(testClient.portfolios).to.have.length(1);
            expect(testClient.portfolios[0].stocks).to.have.length(2);
            expect(testClient.portfolios[0].stocks[0].shares).to.equal(2);
            done();
          });
        });
      });
    });
    it('Will sell stock from two transactions', (done) => {
      const testClient = new Client('President Obama');
      testClient.cash = 10;
      testClient.purchaseStock('all', 4, 'tech', (err) => {
        testClient.purchaseStock('all', 4, 'tech', (err2) => {
          testClient.sellStock('all', 5, 'tech', (err3) => {
            expect(err).to.be.a('null');
            expect(err2).to.be.a('null');
            expect(err3).to.be.a('null');
            expect(testClient.cash).to.equal(7);
            expect(testClient.portfolios).to.have.length(1);
            expect(testClient.portfolios[0].stocks).to.have.length(1);
            expect(testClient.portfolios[0].stocks[0].shares).to.equal(3);
            done();
          });
        });
      });
    });
    it('Will sell as much stock as it can', (done) => {
      done();
    });
  });
});
