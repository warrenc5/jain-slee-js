import * as js from '/resource:js/jain-slee.js';
print("test connection")
var contexts = js.activityMBean.listActivityContexts(true);
console.log("activities : " + (contexts === null ? null : contexts.length));
