import * as js from '/resource:js/jain-slee.js';

console.log("test connection script")
var state = js.sleeMBean.State;
console.log(js.sleeMBean, state);
var contexts = js.activityMBean.listActivityContexts(true);
console.log("activities : " + (contexts === null ? null : contexts.length));
