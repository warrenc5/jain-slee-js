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

try {
    console.log(js.traceMBean.getTraceLevel(new javax.slee.SbbID("name", "vendor", "version")))
} catch (e) {
    console.log("2. " + e);
}

try {
    js.resourceAdaptorMBean.activateResourceAdaptorEntity("SmppRA3");
} catch (e) {
    console.log("3. " + e);
}

if ('activityMBean' in js) {
    try {
        js.activityMBean.endAllActivities();
    } catch (e) {
        console.log("4. " + e);
    }
}
//debug = true

if ('activityMBean' in js) {
    try {
        var contexts = new Array();//java.lang.reflect.Array.newInstance(org.mobicents.slee.container.activity.ActivityContextHandle, 100);
        contexts = js.activityMBean.listActivityContexts(true);
        console.log("activities : ", (contexts === null ? null : contexts.length));
        if (contexts !== null)
            for (var s = 0; s < contexts.length; s++) {
                console.log("context : " + contexts[s].getClass() + " " + util.toString(contexts[s]));
                var achi = 2;
                var ach = contexts[s][achi];
                console.log("ac " + ach);

                try {
                    js.activityMBean.endActivity(ach);
                } catch (e) {
                    console.log("5. " + e);
                }
            }
    } catch (e) {
        console.log("6. " , e.stack);
    }
}

if ('sbbMBean' in js) {
    try {
        var entities = js.sbbMBean.retrieveAllSbbEntities();
        if (entities !== null) {
            console.log("entities: ", entities.length);
            for (var s = 0; s < entities.length; s++) {
                js.sbbMBean.deactivate(entities[s]);
            }
        }
    } catch (e) {
        console.log("7. " + e);
    }
}

//var services = java.lang.reflect.Array.newInstance(ServiceID, 100);
if ('serviceMBean' in js) {
    try {
        var services = js.serviceMBean.getServices();
        console.log("all services", services.length);
        console.log("all services", util.toString(services));
        for (var s = 0; s < services.length; s++) {
            js.serviceMBean.deactivate(services);
        }
    } catch (e) {
        console.log("8. " + e);
    }

    try {
        services = js.serviceMBean.getServices(Java.type('javax.slee.management.ServiceState').ACTIVE);
        console.log("active services", util.toString(services));
        for (var s = 0; s < services.length; s++) {
            js.serviceMBean.deactivate(services);
        }

    } catch (e) {
        console.log("9a. " + e);
    }
    try {
        services = js.serviceMBean.getServices(javax.slee.management.ServiceState.INACTIVE);
        if (services !== null) {
            console.log("inactive services", util.toString(services));
            for (var s = 0; s < services.length; s++) {
                js.serviceMBean.activate(services);
            }
        }

    } catch (e) {
        console.log("9b. " + e);
    }



}
exit 
if ('resourceAdaptorMBean' in js) {
//var ralinks = java.lang.reflect.Array.newInstance(java.lang.String, 100);
    try {
        var ralinks = js.resourceAdaptorMBean.getLinkNames();
        console.log("ra links", util.toString(ralinks));
        for (s in ralinks) {
            js.resourceAdaptorMBean.unbindLinkName(s);
        }
    } catch (e) {
        console.log("10. " + e);
    }

//var raentities = java.lang.reflect.Array.newInstance(java.lang.String, 100);
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

}

if ('deploymentMBean' in js) {
    var deployableUnits;

    try {
        deployableUnits = js.deploymentMBean.DeployableUnits;
        console.log(util.toString(deployableUnits));
    } catch (e) {
        console.log("12. " + e);
    }
    try {
        js.deploymentMBean.uninstall(new javax.slee.management.DeployableUnitID("file:/opt/mobicents-2.3.0/jboss-5.1.0.GA/server/default/deploy/mofokom-du/ideal-services-du-1.0-SNAPSHOT.jar/"));

    } catch (e) {
        console.log("13. " + e);
    }
}