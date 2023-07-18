import * as js from '/resource:js/jain-slee.js'
//js.sleeMBean.help()

var sbbEntityMBean = js.mbean("org.mobicents.slee:name=SbbEntitiesMBean")
sbbEntityMBean.help()

var entities = sbbEntityMBean.retrieveAllSbbEntities();
console.log("All entities",entities.length)

for (var i in entities) {
    var entity = entities[i]
    var k=0
    var sbbEntityId= entity[k++]
    var rootId= entity[k++]
    var parentId= entity[k++]
    var serviceId= entity[k++]
    var priority= entity[k++]
    var sbbId= entity[k++]
    var serviceConvergenceName= entity[k++]
    var usageParameterPath= entity[k++]

    console.log(i, sbbEntityId, rootId ,parentId,serviceId,priority,sbbId,serviceConvergenceName,usageParameterPath)

    var info = sbbEntityMBean.retrieveSbbEntityInfo(sbbEntityId)
    console.log("info",info)
}

var services = js.deploymentMBean.Services
console.log("services",services)

for (var s in services) {
    var service = services[s]
    console.log(services[s])

    //serviceUsageMBean.help()

    var sbbs = js.deploymentMBean.getSbbs(service)

    for (var r in sbbs) {
        var sbb = sbbs[r]
        console.log(sbb.toString())//, Object.keys(sbb))
        var entities = sbbEntityMBean.retrieveSbbEntitiesBySbbId(sbb.toString());

        console.log("entities",entities.length)

        for (var i in entities) {
          var info = sbbEntityMBean.retrieveSbbEntityInfo(entities[i][0]);
          console.log(i, info)

        }
        try {
        } catch (e) {
            console.log(e)
        }
    }

}


