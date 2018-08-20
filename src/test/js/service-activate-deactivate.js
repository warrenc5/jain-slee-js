load('classpath:jain-slee.js');

try {
    resourceMBean.activateResourceAdaptorEntity("SmppRA3");
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

var services = java.lang.reflect.Array.newInstance(ServiceID, 100);
services = serviceMBean.getServices(ServiceState.ACTIVE);
print(toString(services));
for (var s = 0; s < services.length; s++) {
    serviceMBean.deactivate(services);
}

var ralinks = java.lang.reflect.Array.newInstance(java.lang.String, 100);
ralinks = resourceMBean.getLinkNames();
print(toString(ralinks));
for (var s = 0; s < ralinks.length; s++) {
    resourceMBean.unbindLinkName(ralinks[s]);
}

var raentities = java.lang.reflect.Array.newInstance(java.lang.String, 100);
raentities = resourceMBean.getResourceAdaptorEntities();
print(toString(raentities));
for (var s = 0; s < raentities.length; s++) {
    resourceMBean.deactivate(raentities[s]);
}

var deployableUnits = new Array();
deployableUnits = deploymentMBean.DeployableUnits;
print(toString(deployableUnits));
deploymentMBean.uninstall(new DeployableUnitID("file:/opt/mobicents-2.3.0/jboss-5.1.0.GA/server/default/deploy/mofokom-du/ideal-services-du-1.0-SNAPSHOT.jar/"));


deploymentMBean.uninstall(new DeployableUnitID("file:/opt/mobicents-2.3.0/jboss-5.1.0.GA/server/default/deploy/mofokom-du/smpp-ra-DU-2.0.1-MTN-SNAPSHOT.jar/"));
var a = java.lang.reflect.Array.newInstance(javax.slee.ServiceID, 1);

print (service.getClass().getName() + service.getName());
a[0] = s;
try {
    v.deactivate(s);
} catch (x) {
}
try {
    v.activate(a);
} catch (x) {
}


var deployableUnits = new Array();
deployableUnits = deploymentMBean.DeployableUnits;
print(toString(deployableUnits));
deploymentMBean.uninstall(new DeployableUnitID("file:/opt/mobicents-2.3.0/jboss-5.1.0.GA/server/default/deploy/mofokom-du/ideal-services-du-1.0-SNAPSHOT.jar/"));
deploymentMBean.uninstall(new DeployableUnitID("file:/opt/mobicents-2.3.0/jboss-5.1.0.GA/server/default/deploy/mofokom-du/smpp-ra-DU-2.0.1-MTN-SNAPSHOT.jar/"));