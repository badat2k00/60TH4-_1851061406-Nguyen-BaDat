import moment from "moment-timezone";
function convertTime(date) {
  return moment(date).tz("Asia/Ho_Chi_Minh").format("HH:mm:ss DD/MM/YYYY");
}
function AllowUpdateOrder(date, role) {
  let currentTime = moment().tz("Asia/Ho_Chi_Minh");
  let orderdate = moment(date).tz("Asia/Ho_Chi_Minh");
  const diffInMinutes = currentTime.diff(orderdate, "minutes");
    if (
      (diffInMinutes >= 60 && diffInMinutes < (60*72) && role !== "GENERAL") ||
      (diffInMinutes < 60)
    ) {
      return true;
    } else {
      return false;
    }
}
function AllowCancelOrder(date, role) {
  let currentTime = moment().tz("Asia/Ho_Chi_Minh");
  let orderdate = moment(date).tz("Asia/Ho_Chi_Minh");
  const diffInMinutes = currentTime.diff(orderdate, "minutes");
    if (
      (diffInMinutes >= 60 && diffInMinutes < (60*24*7) && role !== "GENERAL") ||
      (diffInMinutes < 60)
    ) {
      return true;
    } else { 
      return false;
    }
}


function getRemainingTime(time) {
  const now = moment().tz("Asia/Ho_Chi_Minh");;
  const createdTime = moment(time).tz("Asia/Ho_Chi_Minh");
  const diff = now - createdTime;
  const remaining = 60*60*1000- diff;
  return remaining > 0 ? remaining : 0;
}

export { convertTime, AllowUpdateOrder,AllowCancelOrder,getRemainingTime };

/* 
dift>60 ++diff<72 
dift<60+GENERAL




*/
