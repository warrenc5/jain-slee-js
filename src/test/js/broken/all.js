load('classpath:jain-slee.js');

//var deployBase = 'file:///tmp/';
var deployBase = 'file:///opt/mobicents/server/default/deploy/mofokom/';

var serviceID = new javax.slee.management.ServiceID('XmlRpc Service', 'MOFOKOM', '1.0');

var sbbID = new javax.slee.management.SbbID('XmlRpc Sbb', 'MOFOKOM', '1.0');

/*
 //get sbb tracer names
 var tracerNames = traceMBean.getSbbTracerNames(serviceID,sbbID);
 //get sbb tracer level
 
 for(var i=0; i < tracerNames.length; i++){
 traceMBean.getTracerLevel(serviceID,sbbID,tracerNames[i]);
 debug(serviceID + ' ' + sbbID + ' ' + tracerNames[i] + level);
 }
 
 //set sbb tracer level
 traceMBean.setSbbTracerLevel(serviceID,javax.slee.facilities.TraceLevel.FINEST);
 */


//locate ra with type



var raLinkName = 'XmlRpc Resource Adaptor Entity Link';
var raEntityName = 'xmlrpc-entity';

var raID = new ResourceAdaptorID('XmlRpc Resource Adaptor', 'MOFOKOM', '1.0');

var properties = new javax.slee.resource.ConfigProperties();

properties.addProperty(new javax.slee.resource.ConfigProperties.Property('DEST_URL', 'java.lang.String', '/xmlrpc-www-1.0-SNAPSHOT/XMLRPCValidatingServlet'));

properties.addProperty(new javax.slee.resource.ConfigProperties.Property('DEST_PORT', 'java.lang.Integer', java.lang.Integer.valueOf(8080)));

properties.addProperty(new javax.slee.resource.ConfigProperties.Property('LISTEN_HOST', 'java.lang.String', 'localhost'));

properties.addProperty(new javax.slee.resource.ConfigProperties.Property('LISTEN_PORT', 'java.lang.Integer', java.lang.Integer.valueOf(8089)));

properties.addProperty(new javax.slee.resource.ConfigProperties.Property('DEST_HOST', 'java.lang.String', 'localhost'));

properties.addProperty(new javax.slee.resource.ConfigProperties.Property('AUTHENTICATION', 'java.lang.Boolean', java.lang.Boolean.valueOf(false)));

properties.addProperty(new javax.slee.resource.ConfigProperties.Property('REALM_USER_NAME', 'java.lang.String', 'admin'));

properties.addProperty(new javax.slee.resource.ConfigProperties.Property('REALM_USER_PASSWORD', 'java.lang.String', 'admin'));

properties.addProperty(new javax.slee.resource.ConfigProperties.Property('ACTIVITY_DIMENSION', 'java.lang.Integer', java.lang.Integer.valueOf(10000)));

properties.addProperty(new javax.slee.resource.ConfigProperties.Property('SOCKET_BUFFER_SIZE', 'java.lang.Integer', java.lang.Integer.valueOf(2048)));

properties.addProperty(new javax.slee.resource.ConfigProperties.Property('SOCKET_TIMEOUT', 'java.lang.Integer', java.lang.Integer.valueOf(500)));

properties.addProperty(new javax.slee.resource.ConfigProperties.Property('TCP_NO_DELAY', 'java.lang.Boolean', java.lang.Boolean.valueOf(true)));

properties.addProperty(new javax.slee.resource.ConfigProperties.Property('MAX_CONNECTIONS', 'java.lang.Integer', java.lang.Integer.valueOf(1)));

properties.addProperty(new javax.slee.resource.ConfigProperties.Property('STALE_CONNECTIONS_CHECK', 'java.lang.Boolean', java.lang.Boolean.valueOf(true)));

properties.addProperty(new javax.slee.resource.ConfigProperties.Property('CONNECTION_TIMEOUT', 'java.lang.Integer', java.lang.Integer.valueOf(1000)));

properties.addProperty(new javax.slee.resource.ConfigProperties.Property('USER_AGENT', 'java.lang.String', 'SLEE/3.1/1.0'));

properties.addProperty(new javax.slee.resource.ConfigProperties.Property('SHUTDOWN_TIME', 'java.lang.Long', java.lang.Long.valueOf(5000)));

properties.addProperty(new javax.slee.resource.ConfigProperties.Property('ENCODER_BUFFER_SIZE', 'java.lang.Integer', java.lang.Integer.valueOf(5000)));

properties.addProperty(new javax.slee.resource.ConfigProperties.Property('ENCODER_STREAMING', 'java.lang.Boolean', java.lang.Boolean.valueOf(true)));

properties.addProperty(new javax.slee.resource.ConfigProperties.Property('ENCODER_CHUNKING', 'java.lang.Boolean', java.lang.Boolean.valueOf(true)));

properties.addProperty(new javax.slee.resource.ConfigProperties.Property('WORK_QUEUE', 'java.lang.Integer', java.lang.Integer.valueOf(1)));

properties.addProperty(new javax.slee.resource.ConfigProperties.Property('POOL_SIZE', 'java.lang.Integer', java.lang.Integer.valueOf(2)));

properties.addProperty(new javax.slee.resource.ConfigProperties.Property('MAX_POOL_SIZE', 'java.lang.Integer', java.lang.Integer.valueOf(3)));

properties.addProperty(new javax.slee.resource.ConfigProperties.Property('POOL_TIMEOUT', 'java.lang.Long', java.lang.Long.valueOf(120)));

properties.addProperty(new javax.slee.resource.ConfigProperties.Property('RESPONSE_TIMEOUT', 'java.lang.Long', java.lang.Long.valueOf(500)));


var installed = false;
try {
    resourceAdaptorMBean.getResourceAdaptor(raEntityName);
    installed = true;
} catch (x) {
    //not installed
}

//already installed 
if (installed) {

    //get state
    var state = resourceAdaptorMBean.getState(raEntityName);

    if (javax.slee.management.ResourceAdaptorEntityState.ACTIVE.equals(state)) {
        //deactivate ra entity
        resourceAdaptorMBean.deactivateResourceAdaptorEntity(raEntityName);
    }

    if (resourceAdaptorMBean.getLinkNames(raEntityName).length != 0) {
        resourceAdaptorMBean.unbindLinkName(raLinkName);
    }

    resourceAdaptorMBean.removeResourceAdaptorEntity(raEntityName);
} else {
    //create ra entity
    resourceAdaptorMBean.createResourceAdaptorEntity(raID, raEntityName, properties);

    //bind link
    resourceAdaptorMBean.bindLinkName(raEntityName, raLinkName);

    //activate ra entity
    resourceAdaptorMBean.activateResourceAdaptorEntity(raEntityName);
}

//get ra entity tracer 
var tracerNames = traceMBean.getResourceAdaptorEntityTracerNames(raEntityName);

//set ra entity tracer nb. FINEST -root = ""
if (tracerNames != undefined) {
    for (var i = 0; i < tracerNames.length; i++) {
        var lever = traceMBean.getTracerLevel(raEntityName, tracerNames[i]);
        traceMBean.setResourceAdaptorEntityTraceLevel(raEntityName, tracerName[i], javax.slee.facilities.TraceLevel.FINEST);
        debug(raEntityName + ' ' + tracerNames[i] + ' ' + level.toString());
    }
}



var serviceID = new ServiceID('XmlRpc Service', 'MOFOKOM', '1.0');

var sbbID = new SbbID('XmlRpc Sbb', 'MOFOKOM', '1.0');

/*
 //get sbb tracer names
 var tracerNames = traceMBean.getSbbTracerNames(serviceID,sbbID);
 //get sbb tracer level
 
 for(var i=0; i < tracerNames.length; i++){
 traceMBean.getTracerLevel(serviceID,sbbID,tracerNames[i]);
 debug(serviceID + ' ' + sbbID + ' ' + tracerNames[i] + level);
 }
 
 //set sbb tracer level
 traceMBean.setSbbTracerLevel(serviceID,javax.slee.facilities.TraceLevel.FINEST);
 */


//locate ra with type



var raLinkName = 'XmlRpc Resource Adaptor Entity Link';
var raEntityName = 'xmlrpc-entity';

var raID = new ResourceAdaptorID('XmlRpc Resource Adaptor', 'MOFOKOM', '1.0');

var properties = new javax.slee.resource.ConfigProperties();

properties.addProperty(new javax.slee.resource.ConfigProperties.Property('DEST_URL', 'java.lang.String', '/xmlrpc-www-1.0-SNAPSHOT/XMLRPCValidatingServlet'));

properties.addProperty(new javax.slee.resource.ConfigProperties.Property('DEST_PORT', 'java.lang.Integer', java.lang.Integer.valueOf(8080)));

properties.addProperty(new javax.slee.resource.ConfigProperties.Property('LISTEN_HOST', 'java.lang.String', 'localhost'));

properties.addProperty(new javax.slee.resource.ConfigProperties.Property('LISTEN_PORT', 'java.lang.Integer', java.lang.Integer.valueOf(8089)));

properties.addProperty(new javax.slee.resource.ConfigProperties.Property('DEST_HOST', 'java.lang.String', 'localhost'));

properties.addProperty(new javax.slee.resource.ConfigProperties.Property('AUTHENTICATION', 'java.lang.Boolean', java.lang.Boolean.valueOf(false)));

properties.addProperty(new javax.slee.resource.ConfigProperties.Property('REALM_USER_NAME', 'java.lang.String', 'admin'));

properties.addProperty(new javax.slee.resource.ConfigProperties.Property('REALM_USER_PASSWORD', 'java.lang.String', 'admin'));

properties.addProperty(new javax.slee.resource.ConfigProperties.Property('ACTIVITY_DIMENSION', 'java.lang.Integer', java.lang.Integer.valueOf(10000)));

properties.addProperty(new javax.slee.resource.ConfigProperties.Property('SOCKET_BUFFER_SIZE', 'java.lang.Integer', java.lang.Integer.valueOf(2048)));

properties.addProperty(new javax.slee.resource.ConfigProperties.Property('SOCKET_TIMEOUT', 'java.lang.Integer', java.lang.Integer.valueOf(500)));

properties.addProperty(new javax.slee.resource.ConfigProperties.Property('TCP_NO_DELAY', 'java.lang.Boolean', java.lang.Boolean.valueOf(true)));

properties.addProperty(new javax.slee.resource.ConfigProperties.Property('MAX_CONNECTIONS', 'java.lang.Integer', java.lang.Integer.valueOf(1)));

properties.addProperty(new javax.slee.resource.ConfigProperties.Property('STALE_CONNECTIONS_CHECK', 'java.lang.Boolean', java.lang.Boolean.valueOf(true)));

properties.addProperty(new javax.slee.resource.ConfigProperties.Property('CONNECTION_TIMEOUT', 'java.lang.Integer', java.lang.Integer.valueOf(1000)));

properties.addProperty(new javax.slee.resource.ConfigProperties.Property('USER_AGENT', 'java.lang.String', 'SLEE/3.1/1.0'));

properties.addProperty(new javax.slee.resource.ConfigProperties.Property('SHUTDOWN_TIME', 'java.lang.Long', java.lang.Long.valueOf(5000)));

properties.addProperty(new javax.slee.resource.ConfigProperties.Property('ENCODER_BUFFER_SIZE', 'java.lang.Integer', java.lang.Integer.valueOf(5000)));

properties.addProperty(new javax.slee.resource.ConfigProperties.Property('ENCODER_STREAMING', 'java.lang.Boolean', java.lang.Boolean.valueOf(true)));

properties.addProperty(new javax.slee.resource.ConfigProperties.Property('ENCODER_CHUNKING', 'java.lang.Boolean', java.lang.Boolean.valueOf(true)));

properties.addProperty(new javax.slee.resource.ConfigProperties.Property('WORK_QUEUE', 'java.lang.Integer', java.lang.Integer.valueOf(1)));

properties.addProperty(new javax.slee.resource.ConfigProperties.Property('POOL_SIZE', 'java.lang.Integer', java.lang.Integer.valueOf(2)));

properties.addProperty(new javax.slee.resource.ConfigProperties.Property('MAX_POOL_SIZE', 'java.lang.Integer', java.lang.Integer.valueOf(3)));

properties.addProperty(new javax.slee.resource.ConfigProperties.Property('POOL_TIMEOUT', 'java.lang.Long', java.lang.Long.valueOf(120)));

properties.addProperty(new javax.slee.resource.ConfigProperties.Property('RESPONSE_TIMEOUT', 'java.lang.Long', java.lang.Long.valueOf(500)));


var installed = false;
try {
    resourceAdaptorMBean.getResourceAdaptor(raEntityName);
    installed = true;
} catch (x) {
    //not installed
}

//already installed 
if (installed) {

    //get state
    var state = resourceAdaptorMBean.getState(raEntityName);

    if (javax.slee.management.ResourceAdaptorEntityState.ACTIVE.equals(state)) {
        //deactivate ra entity
        resourceAdaptorMBean.deactivateResourceAdaptorEntity(raEntityName);
    }

    if (resourceAdaptorMBean.getLinkNames(raEntityName).length != 0) {
        resourceAdaptorMBean.unbindLinkName(raLinkName);
    }

    resourceAdaptorMBean.removeResourceAdaptorEntity(raEntityName);
} else {
    //create ra entity
    resourceAdaptorMBean.createResourceAdaptorEntity(raID, raEntityName, properties);

    //bind link
    resourceAdaptorMBean.bindLinkName(raEntityName, raLinkName);

    //activate ra entity
    resourceAdaptorMBean.activateResourceAdaptorEntity(raEntityName);
}

//get ra entity tracer 
var tracerNames = traceMBean.getResourceAdaptorEntityTracerNames(raEntityName);

//set ra entity tracer nb. FINEST -root = ""
if (tracerNames != undefined) {
    for (var i = 0; i < tracerNames.length; i++) {
        var lever = traceMBean.getTracerLevel(raEntityName, tracerNames[i]);
        traceMBean.setResourceAdaptorEntityTraceLevel(raEntityName, tracerName[i], javax.slee.facilities.TraceLevel.FINEST);
        debug(raEntityName + ' ' + tracerNames[i] + ' ' + level.toString());
    }
}

var duID;
try {
    duID = deploymentMBean.getDeployableUnit(deployBase + 'xmlrpc-service-du-1.0-SNAPSHOT.jar');
    print(duID.toString());
} catch (x) {
    print(x);
}

if (duID == null)
    deploymentMBean.install(deployBase + 'xmlrpc-service-du-1.0-SNAPSHOT.jar');
else
    deploymentMBean.uninstall(duID);

var serviceId = new ServiceID('XmlRpc Service', 'MOFOKOM', '1.0');

//get state
var serviceState = serviceMBean.getState(serviceId);

//toggle 
if (serviceState.isInactive()) {
    //activate service
    serviceMBean.activate(serviceId);
} else {
    //deactivate service
    serviceMBean.deactivate(serviceId);
}


var serviceID = new ServiceID('XmlRpc Service', 'MOFOKOM', '1.0');

var sbbID = new SbbID('XmlRpc Sbb', 'MOFOKOM', '1.0');

/*
 //get sbb tracer names
 var tracerNames = traceMBean.getSbbTracerNames(serviceID,sbbID);
 //get sbb tracer level
 
 for(var i=0; i < tracerNames.length; i++){
 traceMBean.getTracerLevel(serviceID,sbbID,tracerNames[i]);
 debug(serviceID + ' ' + sbbID + ' ' + tracerNames[i] + level);
 }
 
 //set sbb tracer level
 traceMBean.setSbbTracerLevel(serviceID,javax.slee.facilities.TraceLevel.FINEST);
 */


//locate ra with type



var raLinkName = 'XmlRpc Resource Adaptor Entity Link';
var raEntityName = 'xmlrpc-entity';

var raID = new ResourceAdaptorID('XmlRpc Resource Adaptor', 'MOFOKOM', '1.0');

var properties = new javax.slee.resource.ConfigProperties();

properties.addProperty(new javax.slee.resource.ConfigProperties.Property('DEST_URL', 'java.lang.String', '/xmlrpc-www-1.0-SNAPSHOT/XMLRPCValidatingServlet'));

properties.addProperty(new javax.slee.resource.ConfigProperties.Property('DEST_PORT', 'java.lang.Integer', java.lang.Integer.valueOf(8080)));

properties.addProperty(new javax.slee.resource.ConfigProperties.Property('LISTEN_HOST', 'java.lang.String', 'localhost'));

properties.addProperty(new javax.slee.resource.ConfigProperties.Property('LISTEN_PORT', 'java.lang.Integer', java.lang.Integer.valueOf(8089)));

properties.addProperty(new javax.slee.resource.ConfigProperties.Property('DEST_HOST', 'java.lang.String', 'localhost'));

properties.addProperty(new javax.slee.resource.ConfigProperties.Property('AUTHENTICATION', 'java.lang.Boolean', java.lang.Boolean.valueOf(false)));

properties.addProperty(new javax.slee.resource.ConfigProperties.Property('REALM_USER_NAME', 'java.lang.String', 'admin'));

properties.addProperty(new javax.slee.resource.ConfigProperties.Property('REALM_USER_PASSWORD', 'java.lang.String', 'admin'));

properties.addProperty(new javax.slee.resource.ConfigProperties.Property('ACTIVITY_DIMENSION', 'java.lang.Integer', java.lang.Integer.valueOf(10000)));

properties.addProperty(new javax.slee.resource.ConfigProperties.Property('SOCKET_BUFFER_SIZE', 'java.lang.Integer', java.lang.Integer.valueOf(2048)));

properties.addProperty(new javax.slee.resource.ConfigProperties.Property('SOCKET_TIMEOUT', 'java.lang.Integer', java.lang.Integer.valueOf(500)));

properties.addProperty(new javax.slee.resource.ConfigProperties.Property('TCP_NO_DELAY', 'java.lang.Boolean', java.lang.Boolean.valueOf(true)));

properties.addProperty(new javax.slee.resource.ConfigProperties.Property('MAX_CONNECTIONS', 'java.lang.Integer', java.lang.Integer.valueOf(1)));

properties.addProperty(new javax.slee.resource.ConfigProperties.Property('STALE_CONNECTIONS_CHECK', 'java.lang.Boolean', java.lang.Boolean.valueOf(true)));

properties.addProperty(new javax.slee.resource.ConfigProperties.Property('CONNECTION_TIMEOUT', 'java.lang.Integer', java.lang.Integer.valueOf(1000)));

properties.addProperty(new javax.slee.resource.ConfigProperties.Property('USER_AGENT', 'java.lang.String', 'SLEE/3.1/1.0'));

properties.addProperty(new javax.slee.resource.ConfigProperties.Property('SHUTDOWN_TIME', 'java.lang.Long', java.lang.Long.valueOf(5000)));

properties.addProperty(new javax.slee.resource.ConfigProperties.Property('ENCODER_BUFFER_SIZE', 'java.lang.Integer', java.lang.Integer.valueOf(5000)));

properties.addProperty(new javax.slee.resource.ConfigProperties.Property('ENCODER_STREAMING', 'java.lang.Boolean', java.lang.Boolean.valueOf(true)));

properties.addProperty(new javax.slee.resource.ConfigProperties.Property('ENCODER_CHUNKING', 'java.lang.Boolean', java.lang.Boolean.valueOf(true)));

properties.addProperty(new javax.slee.resource.ConfigProperties.Property('WORK_QUEUE', 'java.lang.Integer', java.lang.Integer.valueOf(1)));

properties.addProperty(new javax.slee.resource.ConfigProperties.Property('POOL_SIZE', 'java.lang.Integer', java.lang.Integer.valueOf(2)));

properties.addProperty(new javax.slee.resource.ConfigProperties.Property('MAX_POOL_SIZE', 'java.lang.Integer', java.lang.Integer.valueOf(3)));

properties.addProperty(new javax.slee.resource.ConfigProperties.Property('POOL_TIMEOUT', 'java.lang.Long', java.lang.Long.valueOf(120)));

properties.addProperty(new javax.slee.resource.ConfigProperties.Property('RESPONSE_TIMEOUT', 'java.lang.Long', java.lang.Long.valueOf(500)));


var installed = false;
try {
    resourceAdaptorMBean.getResourceAdaptor(raEntityName);
    installed = true;
} catch (x) {
    //not installed
}

//already installed 
if (installed) {

    //get state
    var state = resourceAdaptorMBean.getState(raEntityName);

    if (javax.slee.management.ResourceAdaptorEntityState.ACTIVE.equals(state)) {
        //deactivate ra entity
        resourceAdaptorMBean.deactivateResourceAdaptorEntity(raEntityName);
    }

    if (resourceAdaptorMBean.getLinkNames(raEntityName).length != 0) {
        resourceAdaptorMBean.unbindLinkName(raLinkName);
    }

    resourceAdaptorMBean.removeResourceAdaptorEntity(raEntityName);
} else {
    //create ra entity
    resourceAdaptorMBean.createResourceAdaptorEntity(raID, raEntityName, properties);

    //bind link
    resourceAdaptorMBean.bindLinkName(raEntityName, raLinkName);

    //activate ra entity
    resourceAdaptorMBean.activateResourceAdaptorEntity(raEntityName);
}

//get ra entity tracer 
var tracerNames = traceMBean.getResourceAdaptorEntityTracerNames(raEntityName);

//set ra entity tracer nb. FINEST -root = ""
for (var i = 0; i < tracerNames.length; i++) {
    var lever = traceMBean.getTracerLevel(raEntityName, tracerNames[i]);
    traceMBean.setResourceAdaptorEntityTraceLevel(raEntityName, tracerName[i], javax.slee.facilities.TraceLevel.FINEST);
    debug(raEntityName + ' ' + tracerNames[i] + ' ' + level.toString());
}



var serviceID = new ServiceID('XmlRpc Service', 'MOFOKOM', '1.0');

var sbbID = new SbbID('XmlRpc Sbb', 'MOFOKOM', '1.0');

/*
 //get sbb tracer names
 var tracerNames = traceMBean.getSbbTracerNames(serviceID,sbbID);
 //get sbb tracer level
 
 for(var i=0; i < tracerNames.length; i++){
 traceMBean.getTracerLevel(serviceID,sbbID,tracerNames[i]);
 debug(serviceID + ' ' + sbbID + ' ' + tracerNames[i] + level);
 }
 
 //set sbb tracer level
 traceMBean.setSbbTracerLevel(serviceID,javax.slee.facilities.TraceLevel.FINEST);
 */


//locate ra with type



var raLinkName = 'XmlRpc Resource Adaptor Entity Link';
var raEntityName = 'xmlrpc-entity';

var raID = new ResourceAdaptorID('XmlRpc Resource Adaptor', 'MOFOKOM', '1.0');

var properties = new javax.slee.resource.ConfigProperties();

properties.addProperty(new javax.slee.resource.ConfigProperties.Property('DEST_URL', 'java.lang.String', '/xmlrpc-www-1.0-SNAPSHOT/XMLRPCValidatingServlet'));

properties.addProperty(new javax.slee.resource.ConfigProperties.Property('DEST_PORT', 'java.lang.Integer', java.lang.Integer.valueOf(8080)));

properties.addProperty(new javax.slee.resource.ConfigProperties.Property('LISTEN_HOST', 'java.lang.String', 'localhost'));

properties.addProperty(new javax.slee.resource.ConfigProperties.Property('LISTEN_PORT', 'java.lang.Integer', java.lang.Integer.valueOf(8089)));

properties.addProperty(new javax.slee.resource.ConfigProperties.Property('DEST_HOST', 'java.lang.String', 'localhost'));

properties.addProperty(new javax.slee.resource.ConfigProperties.Property('AUTHENTICATION', 'java.lang.Boolean', java.lang.Boolean.valueOf(false)));

properties.addProperty(new javax.slee.resource.ConfigProperties.Property('REALM_USER_NAME', 'java.lang.String', 'admin'));

properties.addProperty(new javax.slee.resource.ConfigProperties.Property('REALM_USER_PASSWORD', 'java.lang.String', 'admin'));

properties.addProperty(new javax.slee.resource.ConfigProperties.Property('ACTIVITY_DIMENSION', 'java.lang.Integer', java.lang.Integer.valueOf(10000)));

properties.addProperty(new javax.slee.resource.ConfigProperties.Property('SOCKET_BUFFER_SIZE', 'java.lang.Integer', java.lang.Integer.valueOf(2048)));

properties.addProperty(new javax.slee.resource.ConfigProperties.Property('SOCKET_TIMEOUT', 'java.lang.Integer', java.lang.Integer.valueOf(500)));

properties.addProperty(new javax.slee.resource.ConfigProperties.Property('TCP_NO_DELAY', 'java.lang.Boolean', java.lang.Boolean.valueOf(true)));

properties.addProperty(new javax.slee.resource.ConfigProperties.Property('MAX_CONNECTIONS', 'java.lang.Integer', java.lang.Integer.valueOf(1)));

properties.addProperty(new javax.slee.resource.ConfigProperties.Property('STALE_CONNECTIONS_CHECK', 'java.lang.Boolean', java.lang.Boolean.valueOf(true)));

properties.addProperty(new javax.slee.resource.ConfigProperties.Property('CONNECTION_TIMEOUT', 'java.lang.Integer', java.lang.Integer.valueOf(1000)));

properties.addProperty(new javax.slee.resource.ConfigProperties.Property('USER_AGENT', 'java.lang.String', 'SLEE/3.1/1.0'));

properties.addProperty(new javax.slee.resource.ConfigProperties.Property('SHUTDOWN_TIME', 'java.lang.Long', java.lang.Long.valueOf(5000)));

properties.addProperty(new javax.slee.resource.ConfigProperties.Property('ENCODER_BUFFER_SIZE', 'java.lang.Integer', java.lang.Integer.valueOf(5000)));

properties.addProperty(new javax.slee.resource.ConfigProperties.Property('ENCODER_STREAMING', 'java.lang.Boolean', java.lang.Boolean.valueOf(true)));

properties.addProperty(new javax.slee.resource.ConfigProperties.Property('ENCODER_CHUNKING', 'java.lang.Boolean', java.lang.Boolean.valueOf(true)));

properties.addProperty(new javax.slee.resource.ConfigProperties.Property('WORK_QUEUE', 'java.lang.Integer', java.lang.Integer.valueOf(1)));

properties.addProperty(new javax.slee.resource.ConfigProperties.Property('POOL_SIZE', 'java.lang.Integer', java.lang.Integer.valueOf(2)));

properties.addProperty(new javax.slee.resource.ConfigProperties.Property('MAX_POOL_SIZE', 'java.lang.Integer', java.lang.Integer.valueOf(3)));

properties.addProperty(new javax.slee.resource.ConfigProperties.Property('POOL_TIMEOUT', 'java.lang.Long', java.lang.Long.valueOf(120)));

properties.addProperty(new javax.slee.resource.ConfigProperties.Property('RESPONSE_TIMEOUT', 'java.lang.Long', java.lang.Long.valueOf(500)));


var installed = false;
try {
    resourceAdaptorMBean.getResourceAdaptor(raEntityName);
    installed = true;
} catch (x) {
    //not installed
}

//already installed 
if (installed) {

    //get state
    var state = resourceAdaptorMBean.getState(raEntityName);

    if (javax.slee.management.ResourceAdaptorEntityState.ACTIVE.equals(state)) {
        //deactivate ra entity
        resourceAdaptorMBean.deactivateResourceAdaptorEntity(raEntityName);
    }

    if (resourceAdaptorMBean.getLinkNames(raEntityName).length != 0) {
        resourceAdaptorMBean.unbindLinkName(raLinkName);
    }

    resourceAdaptorMBean.removeResourceAdaptorEntity(raEntityName);
} else {
    //create ra entity
    resourceAdaptorMBean.createResourceAdaptorEntity(raID, raEntityName, properties);

    //bind link
    resourceAdaptorMBean.bindLinkName(raEntityName, raLinkName);

    //activate ra entity
    resourceAdaptorMBean.activateResourceAdaptorEntity(raEntityName);
}

//get ra entity tracer 
var tracerNames = traceMBean.getResourceAdaptorEntityTracerNames(raEntityName);

//set ra entity tracer nb. FINEST -root = ""
for (var i = 0; i < tracerNames.length; i++) {
    var lever = traceMBean.getTracerLevel(raEntityName, tracerNames[i]);
    traceMBean.setResourceAdaptorEntityTraceLevel(raEntityName, tracerName[i], javax.slee.facilities.TraceLevel.FINEST);
    debug(raEntityName + ' ' + tracerNames[i] + ' ' + level.toString());
}

	