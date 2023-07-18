import * as js from '/resource:js/jain-slee.js';

var remove = false

var sbbs = js.sbbMBean.retrieveAllSbbEntities();

console.log("sbb entities" , sbbs.length, "isArray", Array.isArray(sbbs));

js.toArray(sbbs).forEach((item) => {
    console.log(item);
    if (remove == true){
        js.sbbMBean.removeSbbEntity(item[0]);
    }
});

var contexts = js.activityMBean.listActivityContexts(false);
//js.arrayToString(contexts);

for (var i = 0; i < contexts.length; i++) {

  console.log(contexts[i])
        if (remove == true){
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
