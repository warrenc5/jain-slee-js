load('classpath:jain-slee.js');

try {
    resourceAdaptorMBean.activateResourceAdaptorEntity("SmppRA3");
} catch (e) {
}

try {
    activityMBean.endAllActivities();
} catch (e) {
}

var contexts = new Array();//java.lang.reflect.Array.newInstance(org.mobicents.slee.container.activity.ActivityContextHandle, 100);
contexts = activityMBean.listActivityContexts(true);
for (var s = 0; s < contexts.length; s++) {
    print("context : " + contexts[s].getClass() + " " + toString(contexts[s]));
    var achi = 1;
    var ach = contexts[s][achi].getHandle();
    print("ac " + ach);

    activityMBean.endActivity(ach);
}

//var services = java.lang.reflect.Array.newInstance(ServiceID, 100);
var services = serviceMBean.getServices(ServiceState.ACTIVE);
print(toString(services));
for (var s = 0; s < services.length; s++) {
    serviceMBean.deactivate(services);
}

//var ralinks = java.lang.reflect.Array.newInstance(java.lang.String, 100);
var ralinks = resourceAdaptorMBean.getLinkNames();
print(toString(ralinks));
for (var s = 0; s < ralinks.length; s++) {
    resourceAdaptorMBean.unbindLinkName(ralinks[s]);
}

//var raentities = java.lang.reflect.Array.newInstance(java.lang.String, 100);
var raentities = resourceAdaptorMBean.getResourceAdaptorEntities();
print(toString(raentities));
for (var s = 0; s < raentities.length; s++) {
    resourceAdaptorMBean.deactivate(raentities[s]);
}

var deployableUnits;
try {
    deployableUnits = deploymentMBean.DeployableUnits;
    print(toString(deployableUnits));
} catch (e) {
    print(e);
}
deploymentMBean.uninstall(new DeployableUnitID("file:/opt/mobicents-2.3.0/jboss-5.1.0.GA/server/default/deploy/mofokom-du/ideal-services-du-1.0-SNAPSHOT.jar/"));


deploymentMBean.uninstall(new DeployableUnitID("file:/opt/mobicents-2.3.0/jboss-5.1.0.GA/server/default/deploy/mofokom-du/smpp-ra-DU-2.0.1-MTN-SNAPSHOT.jar/"));
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