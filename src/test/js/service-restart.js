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
    console.log(e);
}

var services = [];
if ('serviceMBean' in js) {
    try {
        var services = js.serviceMBean.getServices(Java.type('javax.slee.management.ServiceState').ACTIVE);
        console.log("active services", util.toString(services));
        for (var s = 0; s < services.length; s++) {
            js.serviceMBean.deactivate(services);
        }
        
    } catch (e) {
        console.log(e);
    }
    
    try {
        services = js.serviceMBean.getServices(javax.slee.management.ServiceState.INACTIVE);
        if (services !== null) {
            console.log("inactive services", util.toString(services));
            js.toArray(services).forEach((service) => {
                js.serviceMBean.activate(service);
            });
        }
        
    } catch (e) {
        console.log(e);
    }
}