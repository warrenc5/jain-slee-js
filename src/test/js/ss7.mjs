import * as js from '/resource:js/jain-slee.js';
console.log("test connection script")
var state = js.sleeMBean.State;

var isup = js.mbean("org.mobicents.ss7:service=ISUPSS7Service");
var cap = js.mbean("org.mobicents.ss7:service=CAPSS7Service");
var map = js.mbean("org.mobicents.ss7:service=MAPSS7Service");
var tcapservice = js.mbean("org.mobicents.ss7:service=TCAPSS7Service");


var sccp = js.mbean("org.mobicents.ss7:layer=SCCP,type=Management,name=SccpStack");
var mtp = js.mbean("org.mobicents.ss7:layer=M3UA,type=Management,name=Mtp3UserPart");
var sctp = js.mbean("org.mobicents.ss7:layer=SCTP,type=Management,name=SCTPManagement");
var tcap = js.mbean("org.mobicents.ss7:layer=TCAP,type=Management,name=TcapStack");

var mbeans = [isup,cap,map,tcapservice,tcap,sccp,sctp,mtp];
mbeans.forEach(m => {
console.log(m)
try {
m.stop();
}catch(e) {
console.log(e)
}
});

var ss7 = js.mbean("jboss.as:subsystem=restcomm-ss7");
console.log("stopping");
ss7.stop();
console.log("stopped");

java.lang.Thread.sleep(8 * 1000);
console.log("starting");
ss7.start();
console.log("started");

mbeans.reverse().forEach(m => {
console.log(m)
try {
m.start();
}catch(e) {
console.log(e)
}
});
