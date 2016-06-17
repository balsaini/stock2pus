const expect = require('chai').expect;
const Portfolio = require('../lib/portfolio');

describe('Portfolio', () => {
  describe('#constructor', () => {
    const testPort = new Portfolio('Tech');

    expect(testPort.name).to.equal('Tech');
    expect(testPort.stocks).to.have.length(0);
  });
  describe('#addStock', () => {
    const testPort = new Portfolio('Tech');
    testPort.addStock({ name: 'Hooray', shares: 10 });
    testPort.addStock({ name: 'Hello', shares: 5 });
    expect(testPort.stocks).to.have.length(2);
  });
  describe('#position', () => {
    const testPort = new Portfolio('EDMS');
    testPort.addStock({ name: 'silly', shares: 5, purchasePricePerShare: 1 });
    testPort.addStock({ name: 'test', shares: 10, purchasePricePerShare: 2 });
    const firstTestResult = testPort.position();
    testPort.stocks[0].shares = 0;
    const secondTestResult = testPort.position();

    expect(firstTestResult).to.equal(25);
    expect(secondTestResult).to.equal(20);
  });
});
