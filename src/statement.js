const amountformater = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
}).format;

function calculateVolumeCredits(volumeCredits, perf, type) {
  volumeCredits += Math.max(perf.audience - 30, 0);
  if ('comedy' === type) {
    volumeCredits += Math.floor(perf.audience / 5)
  };
  return volumeCredits;
}

function appendResultString(result, amount, play, perf) {
  return result += ` ${play.name}: ${amountformater(amount)} (${perf.audience} seats)\n`;
}

function calculateTragedyAmount(audience){
  let amount = 40000;
  if (audience > 30) {
    amount += 1000 * (audience - 30);
  }
  return amount;
}

function statement(invoice, plays) {
  let totalAmount = 0;
  let result = `Statement for ${invoice.customer}\n`;
  let volumeCredits = 0;
  for (let perf of invoice.performances) {
    const play = plays[perf.playID];
    let thisAmount = 0;
    switch (play.type) {
      case 'tragedy':
        thisAmount = calculateTragedyAmount(perf.audience);
        break;
      case 'comedy':
        thisAmount = 30000;
        if (perf.audience > 20) {
          thisAmount += 10000 + 500 * (perf.audience - 20);
        }
        thisAmount += 300 * perf.audience;
        break;
      default:
        throw new Error(` ${play.type}`);
    }
    volumeCredits = calculateVolumeCredits(volumeCredits, perf, play.type);
    result = appendResultString(result, (thisAmount / 100), play, perf);
    totalAmount += thisAmount;
  }
  result += `Amount owed is ${amountformater(totalAmount / 100)}\n`;
  result += `You earned ${volumeCredits} credits \n`;
  return result;
}

module.exports = {
  statement,
};
