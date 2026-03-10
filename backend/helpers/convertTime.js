const moment =require("moment-timezone")

function convertTime(date){
    return moment(date).tz("Asia/Ho_Chi_Minh").format("HH:mm:ss MM/DD/YYYY")
}

module.exports= convertTime