function numberToWords(num) {
  if( !num) return '';
  const a = [
    '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
    'Seventeen', 'Eighteen', 'Nineteen'
  ];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  if ((num = num.toString()).length > 9) return 'Overflow';
  let n = ('000000000' + num).substr(-9).match(/.{1,2}/g);
  let str = '';
  str += (n[0] != 0) ? (a[Number(n[0])] || b[n[0][0]] + ' ' + a[n[0][1]]) + ' Crore ' : '';
  str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + ' Lakh ' : '';
  str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + ' Thousand ' : '';
  str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + ' Hundred ' : '';
  str += (n[4] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + '' : '';
  return str.trim() + ' Rupees Only';
}

function incrementInvoiceId(invoiceId) {
  const suffix = invoiceId.slice(-5);
  const incrementedSuffix = (parseInt(suffix) + 1).toString().padStart(5, '0');
  return invoiceId.slice(0, -5) + incrementedSuffix;
}
function getCurrentYear(date = new Date()) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // JS months are 0-based

  let startYear, endYear;

  if (month >= 4) {
    startYear = year;
    endYear = year + 1;
  } else {
    startYear = year - 1;
    endYear = year;
  }

  return `${startYear}-${endYear}`.replaceAll('20', '');
}
export { numberToWords, incrementInvoiceId, getCurrentYear };