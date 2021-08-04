export function pad2(n) {
  return n <= 9 ? '0' + n : '' + n;
}

export function humanTime(utcOrLive, lt = true) {
  // $FlowFixMe: string > 0 is always false
  if (!(utcOrLive > 0)) {
    return '';
  }

  // $FlowFixMe: just for flow
  const utc = utcOrLive;

  var d = new Date();
  d.setTime(utc * 1000);
  var localTime = !(lt === false);

  var h = localTime ? d.getHours() : d.getUTCHours();
  var m = localTime ? d.getMinutes() : d.getUTCMinutes();
  var s = localTime ? d.getSeconds() : d.getUTCSeconds();

  return pad2(h) + ':' + pad2(m) + ':' + pad2(s);
}
