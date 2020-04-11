print('loading js modules');
const debug = false
//load("target/classes/js/jain-slee.js");
//import {debug} from '/home/wozza/work/code/jslee-js/target/classes/jain-slee.js';
//var pwd = `/home/wozza/work/code/jslee-js/target/classes/`
import * as js from '/resource:js/jain-slee.js';

print('running js ' + Object.keys(js));

try {
    print("connected to " + js.sleeMBean.SleeName
            + " "
            + js.sleeMBean.SleeVendor
            + " "
            + js.sleeMBean.SleeVersion
            + " "
            + js.sleeMBean.State
            );
} catch (e) {
    print(e);
}
try {
    print(js.traceMBean.getTraceLevel(new javax.slee.SbbID("name", "vendor", "version")))
} catch (e) {
    print(e);
}

try {
    js.resourceAdaptorMBean.activateResourceAdaptorEntity("SmppRA3");
} catch (e) {
    print(e);
}

if ('activityMBean' in js) {
    try {
        js.activityMBean.endAllActivities();
    } catch (e) {
        print(e);
    }
}
//debug = true

if ('activityMBean' in js) {
    try {
        var contexts = new Array();//java.lang.reflect.Array.newInstance(org.mobicents.slee.container.activity.ActivityContextHandle, 100);
        contexts = js.activityMBean.listActivityContexts(true);
        print("activities : " + contexts.length);
        for (var s = 0; s < contexts.length; s++) {
            print("context : " + contexts[s].getClass() + " " + toString(contexts[s]));
            var achi = 2;
            var ach = contexts[s][achi];
            print("ac " + ach);

            try {
                js.activityMBean.endActivity(ach);
            } catch (e) {
                print(e);
            }
        }
    } catch (e) {
        print(e);
    }
}

if ('sbbMBean' in js) {
    try {
        var entities = js.sbbMBean.retrieveAllSbbEntities();
        print("entities: ", entities.length + " " + toString(services));
        for (var s = 0; s < entities.length; s++) {
            js.sbbMBean.deactivate(entities[s]);
        }
    } catch (e) {
        print(e);
    }
}

//var services = java.lang.reflect.Array.newInstance(ServiceID, 100);
if ('serviceMBean' in js) {
    try {
        var services = js.serviceMBean.getServices();
        print("all services", services.length);
        print("all services", toString(services));
        for (var s = 0; s < services.length; s++) {
            js.serviceMBean.deactivate(services);
        }
    } catch (e) {
        print(e);
    }

    try {
        services = js.serviceMBean.getServices(javax.slee.management.ServiceState.ACTIVE);
        print("active services", toString(services));
        for (var s = 0; s < services.length; s++) {
            js.serviceMBean.deactivate(services);
        }

    } catch (e) {
        print(e);
    }


}

if ('resourceAdaptorMBean' in js) {
//var ralinks = java.lang.reflect.Array.newInstance(java.lang.String, 100);
    try {
        var ralinks = resourceAdaptorMBean.getLinkNames();
        print("ra links", toString(ralinks));
        for (var s = 0; s < ralinks.length; s++) {
            js.resourceAdaptorMBean.unbindLinkName(ralinks[s]);
        }

    } catch (e) {
        print(e);
    }

//var raentities = java.lang.reflect.Array.newInstance(java.lang.String, 100);
    try {
        var raentities = resourceAdaptorMBean.getResourceAdaptorEntities();
        print("ra entities", toString(raentities));
        for (var s = 0; s < raentities.length; s++) {
            js.resourceAdaptorMBean.deactivate(raentities[s]);
        }

    } catch (e) {
        print(e);
    }

}

if ('deploymentMBean' in js) {
    var deployableUnits;

    try {
        deployableUnits = js.deploymentMBean.DeployableUnits;
        print(toString(deployableUnits));
    } catch (e) {
        print(e);
        e.printStackTrace();
    }
    try {
        js.deploymentMBean.uninstall(new javax.slee.management.DeployableUnitID("file:/opt/mobicents-2.3.0/jboss-5.1.0.GA/server/default/deploy/mofokom-du/ideal-services-du-1.0-SNAPSHOT.jar/"));

    } catch (e) {
        print(e);
    }
}

//var a = java.lang.reflect.Array.newInstance(javax.slee.ServiceID, 1);
var s = services[0];
try {
    v.deactivate(s);
} catch (x) {
}
try {
    v.activate(a);
} catch (x) {
}