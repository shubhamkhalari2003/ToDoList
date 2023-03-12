
module.exports.getDate = getDate;

function getDate(){
  const date = new Date();
  const options = {
    weekday : "long",
    day: "numeric",
    month: "short"
  }
  const day = date.toLocaleString("en-US",options);
  return day;
}

module.exports.getDay = getDay;

function getDay(){
  const date = new Date();
  const options = {
    weekday : "long",
  }
  const day = date.toLocaleString("en-US",options);
  return day;

}
