import * as js from '/resource:js/jain-slee.js'
//js.sleeMBean.help()
var subsystems = js.sleeMBean.Subsystems
var reset = false

for (var k in subsystems) {
    console.log(subsystems[k])
    try {
        var usageParameterSets = js.sleeMBean.getUsageParameterSets(subsystems[k])
        for (var j in usageParameterSets) {
            console.log(usageParameterSets[j])
        }
    } catch (e) {
        //console.log(e);
    }
}
//js.deploymentMBean.help()
//js.serviceMBean.help()

function getServiceUsageMBean(serviceId) {
    return js.mbean(`javax.slee.management.usage:type=ServiceUsage,serviceName="${serviceId.getName()}",serviceVendor="${serviceId.getVendor()}",serviceVersion="${serviceId.getVersion()}"`)
}



var services = js.deploymentMBean.Services
console.log("services",services)

for (var s in services) {
    var service = services[s]
    console.log(services[s])

    var serviceUsageMBean = getServiceUsageMBean(service)
    //serviceUsageMBean.help()

    var sbbs = js.deploymentMBean.getSbbs(service)

    for (var r in sbbs) {
        var sbb = sbbs[r]
        console.log(sbb)
        try {
            var sbbUsageMBean = js.mbean(serviceUsageMBean.getSbbUsageMBean(sbb))
            //sbbUsageMBean.help()
            console.log(JSON.stringify(sbbUsageMBean, null,2))
            //console.log(sbbUsageMBean.info)
            for (const o of sbbUsageMBean.info.getOperations()) {
                if(o.getReturnType() =="javax.slee.usage.SampleStatistics")
                    console.log(o.getName(), sbbUsageMBean[o.getName()](false))
            }
                     /**
            sbbUsageMBean.info.getOperations().filter((o)=>o.getReturnType() =="javax.slee.usage.SampleStatistics")
                    .forEach(
                        (o)=>console.log(o.getName(), sbbUsageMBean[o.getName()](false))
                    )*/
                     
            //console.log(sbbUsageMBean.getMapRestoreDataResponseOKStats(false));
           if(reset == true)
           sbbUsageMBean.resetAllUsageParameters()
        } catch (e) {
            //console.log(e)
        }
        try {
            var sets = serviceUsageMBean.getUsageParameterSets(sbb)
            for (var t in sets) {
                
                var set = sets[t]
                console.log(set);
                //Yadayadayada
            }
        } catch (e) {
            //console.log(e)
        }
    }

}

var resourceAdaptors = js.deploymentMBean.ResourceAdaptors
console.log("resourceAdaptors",resourceAdaptors)

function getResourceUsageMBean(raEntityName) {
    return js.mbean(`javax.slee.management.usage:type=ResourceUsage,raEntityName="${raEntityName}"`)
}

for (var i in resourceAdaptors) {
    console.log(resourceAdaptors[i])

    var raEntities = js.resourceAdaptorMBean.getResourceAdaptorEntities(resourceAdaptors[i]);

    console.log("raEntities: " + raEntities);

    for (var r in raEntities) {
    try {
            var raUsageMBean = getResourceUsageMBean(raEntities[r])

                    //raUsageMBean.help()
                    var usageMBean  = js.mbean(raUsageMBean.UsageMBean)
                    //usageMBean.help()

                    //console.log(JSON.stringify(raUsageMBean, null,2))
                    for (const o of usageMBean.info.getOperations()) {

                      if(o.getName().startsWith("get")) {
                            if(o.getReturnType() =="javax.slee.usage.SampleStatistics")
                                    console.log(o.getName(), usageMBean[o.getName()](false))
                            else if(o.getReturnType() =="long")
                                    console.log(o.getName(), usageMBean[o.getName()](false))
                                    }
                    }
           if(reset == true) {
           console.log("resetting")
                   usageMBean.resetAllUsageParameters()
                   }
        } catch (e) {
            console.log(e)
        }
        }
 
}

