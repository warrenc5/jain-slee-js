print('loading js modules');

//load("target/classes/js/jain-slee.js");
//import {debug} from '/home/wozza/work/code/jslee-js/target/classes/jain-slee.js';
//var pwd = `/home/wozza/work/code/jslee-js/target/classes/`
import * as js from '/resource:js/jain-slee.js';
import * as util from '/resource:js/mofokom/jain-slee-graal/40-slee-util.js'

        print('running js ' + Object.keys(js));

try {
    print("connected to ", js.sleeMBean.SleeName
            , js.sleeMBean.SleeVendor
            , js.sleeMBean.SleeVersion
            , js.sleeMBean.State
            );
} catch (e) {
    print("1. " + e);
}

try {
    print(js.traceMBean.getTraceLevel(new javax.slee.SbbID("name", "vendor", "version")))
} catch (e) {
    print("2. " + e);
}

try {
    js.resourceAdaptorMBean.activateResourceAdaptorEntity("SmppRA3");
} catch (e) {
    print("3. " + e);
}

if ('activityMBean' in js) {
    try {
        js.activityMBean.endAllActivities();
    } catch (e) {
        print("4. " + e);
    }
}
//debug = true

if ('activityMBean' in js) {
    try {
        var contexts = new Array();//java.lang.reflect.Array.newInstance(org.mobicents.slee.container.activity.ActivityContextHandle, 100);
        contexts = js.activityMBean.listActivityContexts(true);
        print("activities : ", (contexts === null ? null : contexts.length));
        if (contexts !== null)
            for (var s = 0; s < contexts.length; s++) {
                print("context : " + contexts[s].getClass() + " " + util.toString(contexts[s]));
                var achi = 2;
                var ach = contexts[s][achi];
                print("ac " + ach);

                try {
                    js.activityMBean.endActivity(ach);
                } catch (e) {
                    print("5. " + e);
                }
            }
    } catch (e) {
        print("6. " + e);
    }
}

if ('sbbMBean' in js) {
    try {
        var entities = js.sbbMBean.retrieveAllSbbEntities();
        if (entities !== null) {
            print("entities: ", entities.length);
            for (var s = 0; s < entities.length; s++) {
                js.sbbMBean.deactivate(entities[s]);
            }
        }
    } catch (e) {
        print("7. " + e);
    }
}

//var services = java.lang.reflect.Array.newInstance(ServiceID, 100);
if ('serviceMBean' in js) {
    try {
        var services = js.serviceMBean.getServices();
        print("all services", services.length);
        print("all services", util.toString(services));
        for (var s = 0; s < services.length; s++) {
            js.serviceMBean.deactivate(services);
        }
    } catch (e) {
        print("8. " + e);
    }

    try {
        services = js.serviceMBean.getServices(Java.type('javax.slee.management.ServiceState').ACTIVE);
        print("active services", util.toString(services));
        for (var s = 0; s < services.length; s++) {
            js.serviceMBean.deactivate(services);
        }

    } catch (e) {
        print("9. " + e);
    }
    try {
        services = js.serviceMBean.getServices(javax.slee.management.ServiceState.INACTIVE);
        if (services !== null) {
            print("inactive services", util.toString(services));
            for (var s = 0; s < services.length; s++) {
                js.serviceMBean.activate(services);
            }
        }

    } catch (e) {
        print("9. " + e);
    }



}

if ('resourceAdaptorMBean' in js) {
//var ralinks = java.lang.reflect.Array.newInstance(java.lang.String, 100);
    try {
        var ralinks = js.resourceAdaptorMBean.getLinkNames();
        print("ra links", util.toString(ralinks));
        for (s in ralinks) {
            js.resourceAdaptorMBean.unbindLinkName(s);
        }
    } catch (e) {
        print("10. " + e);
    }

//var raentities = java.lang.reflect.Array.newInstance(java.lang.String, 100);
    try {
        var raentities = js.resourceAdaptorMBean.getResourceAdaptorEntities();
        print("ra entities", util.toString(raentities));
        for (var s = 0; s < raentities.length; s++) {
            js.resourceAdaptorMBean.deactivateResourceAdaptorEntity(raentities[s]);
        }
        for (var s = 0; s < raentities.length; s++) {
            js.resourceAdaptorMBean.activateResourceAdaptorEntity(raentities[s]);
        }

    } catch (e) {
        print("11. " + e);
    }

}

if ('deploymentMBean' in js) {
    var deployableUnits;

    try {
        deployableUnits = js.deploymentMBean.DeployableUnits;
        print(util.toString(deployableUnits));
    } catch (e) {
        print("12. " + e);
    }
    try {
        js.deploymentMBean.uninstall(new javax.slee.management.DeployableUnitID("file:/opt/mobicents-2.3.0/jboss-5.1.0.GA/server/default/deploy/mofokom-du/ideal-services-du-1.0-SNAPSHOT.jar/"));

    } catch (e) {
        print("13. " + e);
    }
}