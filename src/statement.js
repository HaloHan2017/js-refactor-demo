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

function calculateComedyAmount(audience){
  let amount = 30000;
  if (audience > 20) {
    amount += 10000 + 500 * (audience - 20);
  }
  return amount += 300 * audience;
}

function calculateAmountByType(type,audience){
  if(type === 'tragedy'){
    return calculateTragedyAmount(audience);
  }else if(type === 'comedy'){
    return calculateComedyAmount(audience);
  }else{
    throw new Error(` ${type}`);
  }
}

function statement(invoice, plays) {
  let totalAmount = 0;
  let result = `Statement for ${invoice.customer}\n`;
  let volumeCredits = 0;
  for (let perf of invoice.performances) {
    const play = plays[perf.playID];
    let thisAmount = 0;
    thisAmount = calculateAmountByType(play.type,perf.audience);
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
