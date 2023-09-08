import * as js from '/resource:js/jain-slee.js';

var raId = new javax.slee.resource.ResourceAdaptorID("KafkaResourceAdaptor","com.effortel.ocs.kafka","1.0")
var raEntities = js.resourceAdaptorMBean.getResourceAdaptorEntities(raId);
console.log(raEntities);

var raEntity = raEntities[0]
try {
    var cp = js.resourceAdaptorMBean.getConfigurationProperties(raEntity);
    console.log("configuration: " + cp.toString());
    var v = Java.type('java.lang.Long')
    var vv = new v(1000)
    console.log("value: " , vv, typeof vv)
    cp.getProperty("consumer.poll.timeout").setValue(vv)
    js.resourceAdaptorMBean.updateConfigurationProperties(raEntity, cp);
} catch (e) {
    console.log(e);
}