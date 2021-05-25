import * as js from '/resource:js/jain-slee.js';
import * as util from '/resource:js/mofokom/jain-slee-graal/40-slee-util.js'

console.log('running js ' + Object.keys(js));

try {
    console.log("connected to ", js.sleeMBean.SleeName
            , js.sleeMBean.SleeVendor
            , js.sleeMBean.SleeVersion
            , js.sleeMBean.State
            );
} catch (e) {
    console.log("1. " + e);
}

if ('resourceAdaptorMBean' in js) {
    try {
        var ralinks = js.resourceAdaptorMBean.getLinkNames();
        console.log("ra links", util.toString(ralinks));
        for (s in ralinks) {
            js.resourceAdaptorMBean.unbindLinkName(s);
        }
    } catch (e) {
        console.log("10. " + e);
    }

/*
    try {
        var raentities = js.resourceAdaptorMBean.getResourceAdaptorEntities();
        console.log("ra entities", util.toString(raentities));
        for (var s = 0; s < raentities.length; s++) {
            js.resourceAdaptorMBean.deactivateResourceAdaptorEntity(raentities[s]);
        }
        for (var s = 0; s < raentities.length; s++) {
            js.resourceAdaptorMBean.activateResourceAdaptorEntity(raentities[s]);
        }

    } catch (e) {
        console.log("11. " + e);
    }
*/

}