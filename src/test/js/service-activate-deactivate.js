load('classpath:jain-slee.js');

try {
    resourceAdaptorMBean.activateResourceAdaptorEntity("SmppRA3");
} catch (e) {
}

try {
    activityMBean.endAllActivities();
} catch (e) {
    print(e);
}
debug = true

try {
    var contexts = new Array();//java.lang.reflect.Array.newInstance(org.mobicents.slee.container.activity.ActivityContextHandle, 100);
    contexts = activityMBean.listActivityContexts(true);
    print("activities : " + contexts.length);
    for (var s = 0; s < contexts.length; s++) {
        print("context : " + contexts[s].getClass() + " " + toString(contexts[s]));
        var achi = 2;
        var ach = contexts[s][achi];
        print("ac " + ach);

        try {
            activityMBean.endActivity(ach);
        } catch (e) {
            print(e);
        }
    }
} catch (e) {
    print(e);
}
try {
    var entities = sbbMBean.retrieveAllSbbEntities();
    print("entities: ", entities.length + " " + toString(services));
    for (var s = 0; s < entities.length; s++) {
        sbbMBean.deactivate(entities[s]);
    }
} catch (e) {
    print(e);
}

//var services = java.lang.reflect.Array.newInstance(ServiceID, 100);
try {
    var services = serviceMBean.getServices();
    print("all services", services.length);
    print("all services", toString(services));
    for (var s = 0; s < services.length; s++) {
        serviceMBean.deactivate(services);
    }
} catch (e) {
    print(e);
}

services = serviceMBean.getServices(javax.slee.management.ServiceState.ACTIVE);
print("active services", toString(services));
for (var s = 0; s < services.length; s++) {
    serviceMBean.deactivate(services);
}

//var ralinks = java.lang.reflect.Array.newInstance(java.lang.String, 100);
var ralinks = resourceAdaptorMBean.getLinkNames();
print("ra links", toString(ralinks));
for (var s = 0; s < ralinks.length; s++) {
    resourceAdaptorMBean.unbindLinkName(ralinks[s]);
}

//var raentities = java.lang.reflect.Array.newInstance(java.lang.String, 100);
var raentities = resourceAdaptorMBean.getResourceAdaptorEntities();
print("ra entities", toString(raentities));
for (var s = 0; s < raentities.length; s++) {
    resourceAdaptorMBean.deactivate(raentities[s]);
}

var deployableUnits;
try {
    deployableUnits = deploymentMBean.DeployableUnits;
    print(toString(deployableUnits));
} catch (e) {
    print(e);
    e.printStackTrace();
}
deploymentMBean.uninstall(new javax.slee.management.DeployableUnitID("file:/opt/mobicents-2.3.0/jboss-5.1.0.GA/server/default/deploy/mofokom-du/ideal-services-du-1.0-SNAPSHOT.jar/"));


deploymentMBean.uninstall(new javax.slee.management.DeployableUnitID("file:/opt/mobicents-2.3.0/jboss-5.1.0.GA/server/default/deploy/mofokom-du/smpp-ra-DU-2.0.1-MTN-SNAPSHOT.jar/"));
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