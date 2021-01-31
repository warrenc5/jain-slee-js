import * as js from '/resource:js/jain-slee.js';

function endAllActivities() {
    var contexts = js.activityMBean.listActivityContexts(false);

    js.arrayToString(contexts);

    for (i = 0; i < contexts.length; i++) {
        try {
            activityMBean.endActivity(contexts[i][0]);
        } catch (e) {
            console.log(e);
        }
    }

}

var sbbs = js.sbbMBean.retrieveAllSbbEntities();

console.log(Array.isArray(sbbs));

js.objectArray(sbbs).forEach((item) => {
    console.log(item)
})

for (var i = 0; i < sbbs.length; i++) {
    try {
        console.log(sbbs[i]);
    } catch (e) {
        console.log(e);
    }
}

