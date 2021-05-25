import * as js from '/resource:js/jain-slee.js';

function endAllActivities() {
    var contexts = js.activityMBean.listActivityContexts(false);

    js.arrayToString(contexts);

    for (var i = 0; i < contexts.length; i++) {
        //FIXME: instanceof
        //if(contexts[i][1] === "javax.slee.nullactivity.NullActivity"){ 
        if (contexts[i][1] === "org.mobicents.slee.runtime.facilities.nullactivity.NullActivityImpl") {
            try {
                console.log("ending ", contexts[i]);
                js.activityMBean.endActivity(contexts[i][0]);
            } catch (e) {
                console.log(e);
            }
        }
    }

}

var sbbs = js.sbbMBean.retrieveAllSbbEntities();

console.log(Array.isArray(sbbs));

js.toArray(sbbs).forEach((item) => {
    console.log(item);
    js.sbbMBean.removeSbbEntity(item[0]);
});

endAllActivities();