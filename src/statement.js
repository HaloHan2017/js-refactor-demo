const amountformater = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
}).format;

function calculateVolumeCredits(performances,plays) {
  let volumeCredits = 0;
  for(let perf of performances){
    const play = plays[perf.playID];
    volumeCredits += Math.max(perf.audience - 30, 0);
    if ('comedy' === play.type) {
      volumeCredits += Math.floor(perf.audience / 5)
    };
  }
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

function calculateTotalAmount(performances,plays){
  let totalAmount = 0;
  for (let perf of performances) {
    totalAmount += calculateAmountByType(plays[perf.playID].type,perf.audience);
  }
  return totalAmount;
}

function generatePerformances(performances,plays){
  let resultArray = [];
  for (let perf of performances) {
    const play = plays[perf.playID];
    let item = {
      name : play.name,
      amount : calculateAmountByType(play.type,perf.audience) / 100,
      audience : perf.audience
    }
    resultArray.push(item);
  }
  return resultArray;
}

function printTextByData(data){
  return `Statement for ${data.customer}\n`
        + data.resultArray.map(item => {
          return ` ${item.name}: ${amountformater(item.amount)} (${item.audience} seats)\n`;
        }).join('')
        + `Amount owed is ${data.totalAmount}\n`
        + `You earned ${data.volumeCredits} credits \n`
}

function printHtmlByData(data){
  return `<h1>Statement for ${data.customer}</h1>\n`
        + '<table>\n'
        + '<tr><th>play</th><th>seats</th><th>cost</th></tr>'
        + data.resultArray.map(item => {
          return ` <tr><td>${item.name}</td><td>${item.audience}</td><td>${amountformater(item.amount)}</td></tr>\n`;
        }).join('')
        + '</table>\n'
        + `<p>Amount owed is <em>${data.totalAmount}</em></p>\n`
        + `<p>You earned <em>${data.volumeCredits}</em> credits</p>\n`
}

function statement(invoice, plays) {
  return printTextByData(getPrintResultData(invoice,plays));
}

function statementHTML(invoice, plays){
  return printHtmlByData(getPrintResultData(invoice,plays));
}

function getPrintResultData(invoice,plays){
  return {
    customer : invoice.customer,
    resultArray : generatePerformances(invoice.performances,plays),
    totalAmount : amountformater(calculateTotalAmount(invoice.performances,plays) / 100),
    volumeCredits : calculateVolumeCredits(invoice.performances,plays)
  }
}



module.exports = {
  statement,
  statementHTML
};
