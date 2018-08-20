load('classpath:jain-slee.js');

var contexts = activityMBean.listActivityContexts(false);

arrayToString(contexts);

for (i = 0; i < contexts.length; i++) {
    try {
        activityMBean.endActivity(contexts[i][0]);
    } catch (e) {
        print(e);
    }
}

var sbbs = sbbMBean.retrieveAllSbbEntities();

arrayToString(sbbs);
