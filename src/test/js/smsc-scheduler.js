import * as js from '/resource:js/jain-slee.js';

function endAllActivities() {
    var contexts = js.activityMBean.listActivityContexts(false);

   //js.arrayToString(contexts);

    for (var i = 0; i < contexts.length; i++) {
        try {
            if (contexts[i][1] === "org.mobicents.smsc.slee.resources.scheduler.SchedulerActivityImpl"
            || contexts[i][1] === "org.restcomm.slee.resource.smpp.SmppTransactionImpl") {

                console.log("scheduler ", contexts[i][0]);

                js.toArray(sbbs).forEach((item) => {
                    if (item[5].startsWith(contexts[i][0])) {
                        console.log("ending ", item[0], contexts[i][0]);


                        //js.sbbMBean.removeSbbEntity(item[0]);
                    }
                });


            }
        } catch (e) {
            console.log(e);
        }
    }

}

var sbbs = js.sbbMBean.retrieveAllSbbEntities();
//console.log(Array.isArray(sbbs));

endAllActivities();