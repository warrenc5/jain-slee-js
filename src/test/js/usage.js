import * as js from '/resource:js/jain-slee.js'
//js.sleeMBean.help()
var subsystems = js.sleeMBean.Subsystems

for (var k in subsystems) {
    console.log(subsystems[k])
    try {
        var usageParameterSets = js.sleeMBean.getUsageParameterSets(subsystems[k])
        for (var j in usageParameterSets) {
            console.log(usageParameterSets[j])
        }
    } catch (e) {
        console.log(e);
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
        } catch (e) {
            console.log(e)
        }
        try {
            var sets = serviceUsageMBean.getUsageParameterSets(sbb)
            for (var t in sets) {
                
                var set = sets[t]
                console.log(set);
                //Yadayadayada
            }
        } catch (e) {
            console.log(e)
        }
    }

}


