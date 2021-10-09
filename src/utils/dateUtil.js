import da from "element-plus/packages/locale/lang/da";

export default {
    dateStr(){
        var date = new Date();
        console.log(date);
        var seperator1 = "-";
        var year = date.getFullYear();
        console.log(year)
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        var strHour = date.getHours();
        var min = date.getMinutes();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        if (strHour >= 0 && strHour <= 9) {
            strHour = "0" + strHour;
        }
        if (min >= 0 && min <= 9) {
            min = "0" + min;
        }
        var currentdate = year + "" + month + "" + strDate + "" + strHour + "" + min + "";
        console.log(currentdate);
        return currentdate;
    }
}