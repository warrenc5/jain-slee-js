import * as js from '/resource:js/jain-slee.js';

console.log("help all mbeans");

console.log(js.mbeans)
try {
    js.resourceAdaptorMBean.help();
} catch (e) {
  console.log(e);
}
