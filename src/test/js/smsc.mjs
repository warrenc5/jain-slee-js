import * as js from '/resource:js/jain-slee.js';

function endAllActivities() {
    var contexts = js.activityMBean.listActivityContexts(false);

    if(contexts === null) 
    return;

    js.arrayToString(contexts);

    for (var i in contexts) {
        try {
            js.activityMBean.endActivity(contexts[i][0]);
        } catch (e) {
            console.log(e);
        }
    }

}

function showAllEntities() { 
    var sbbs = js.sbbMBean.retrieveAllSbbEntities();
    console.log(Array.isArray(sbbs));

    js.toArray(sbbs).forEach((item) => {
        console.log(item)
    })
}

try { 
endAllActivities();

        } catch (e) {
            console.log(e.stack);
        }
//showAllEntities();

var smsc = js.mbean("org.mobicents.smsc:layer=SmscStats,name=SmscManagement")

console.log(smsc);
console.log(smsc._ALL_);
var all = smsc._ALL_;
console.log(Array.isArray(all));
for (var a in all) {
    console.log(all[a], smsc[[all[a]]])
}
