import * as js from '/resource:js/jain-slee.js';

while (true) {
    try {
        var raId = new javax.slee.resource.ResourceAdaptorID("KafkaResourceAdaptor", "com.effortel.ocs.kafka", "1.0")
        var raEntities = js.resourceAdaptorMBean.getResourceAdaptorEntities(raId);
        console.log(raEntities);

    } catch (e) {
        console.log(e);
    }
    java.lang.Thread.sleep(3000)
}