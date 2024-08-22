function rnLE(i) {
  let c = "",
    n = 1;
  for (let x = 0; x < i.length; x++)
    i[x] === i[x + 1] ? n++ : ((c += i[x] + (n > 1 ? n : "")), (n = 1));
  return c;
}
function rnLD(i) {
  let d = "",
    n = "";
  for (let x = 0; x < i.length; x++)
    isNaN(i[x])
      ? ((d += i[x].repeat(n ? parseInt(n) : 1)), (n = ""))
      : (n += i[x]);
  return d;
}
function enB64(i) {
  return Buffer.from(rnLE(i)).toString("base64");
}
function deB64(i) {
  return rnLD(Buffer.from(i, "base64").toString("utf8"));
}
module.exports = { enB64, deB64 };
