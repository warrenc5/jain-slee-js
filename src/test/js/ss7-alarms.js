import * as js from '/resource:js/jain-slee.js';
var alarm = js.mbean("org.mobicents.ss7:layer=ALARM,type=Management,name=AlarmHost");

try { 
    var alarmMessageList = alarm.CurrentAlarmList
    alarmMessageList.getCurrentAlarmList()
        .filter(alarmMessage=>alarmMessage.getObjectName().startsWith("AS:"))
        .filter(alarmMessage=>alarmMessage.getProblemName().includes("not active"))
        .forEach(alarmMessage=>console.log(alarmMessage))
} catch (e) {
    console.log(e)
    throw e
}