import * as js from '/resource:js/jain-slee.js'

function removeServiceProfile() {
    var spec = new javax.slee.profile.ProfileSpecificationID('ServiceConfigProfile', 'fr.orange.in', '0.0.1')
    var tableName = 'CestCa'
    var profileName = 'service'
    try {
        js.profileProvMBean.removeProfile(tableName, profileName)
        console.log("removed")
        return
    } catch (e) {
        console.log(e)
    }
    js.profileProvMBean.removeProfileTable(tableName)
}

function updateServiceProfile(newObject) {
    var spec = new javax.slee.profile.ProfileSpecificationID('ServiceConfigProfile', 'fr.orange.in', '0.0.1')
    var tableName = 'CestCa'
    var profileName = 'service'
    var profile = js.updateProfile(spec, tableName, profileName, newObject)
}

function removeHniProfile(name) {
    var tableName = 'HNI Profile Table'
    var profileName = name
    try {
        js.profileProvMBean.removeProfile(tableName, profileName)
    } catch (e) {
        console.log(e)
    }
}

function updateHniProfile(newObject) {
    var spec = new javax.slee.profile.ProfileSpecificationID('HNIProfile', 'fr.orange.in', '0.0.1')
    var tableName = 'HNI Profile Table'
    var profileName = newObject.Hni
    var profile = js.updateProfile(spec, tableName, profileName, newObject)
}
//removeServiceProfile()

console.log(js.profileProvMBean)

try {
    js.profileProvMBean.removeProfileTable('HNI Profile Table')
} catch (e) {
    console.log(e)
}

load('data.js');
updateServiceProfile(service)
data.forEach((item)=>updateHniProfile(item))
