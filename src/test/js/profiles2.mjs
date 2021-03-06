import * as js from '/resource:js/jain-slee.js'

function removeServiceProfile() {
    var spec = new javax.slee.profile.ProfileSpecificationID('ServiceConfigProfile', 'fr.orange.in', '0.0.2')
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
    var spec = new javax.slee.profile.ProfileSpecificationID('ServiceConfigProfile', 'fr.orange.in', '0.0.2')
    var tableName = 'CestCa'
    var profileName = 'service'
    var profile = js.updateProfile(spec, tableName, profileName, newObject)
    console.log("created profile", JSON.stringify(profile))
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
    var spec = new javax.slee.profile.ProfileSpecificationID('HNIGTProfile', 'fr.orange.in', '0.0.2')
    var tableName = 'HNI Profile Table'
    var profileName = newObject.Hni
    var profile = js.updateProfile(spec, tableName, profileName, newObject)
}

function updateCcProfile(newObject) {
    var spec = new javax.slee.profile.ProfileSpecificationID('CCGTProfile', 'fr.orange.in', '0.0.2')
    var tableName = 'CC Profile Table'
    var profileName = newObject.Cc
    var profile = js.updateProfile(spec, tableName, profileName, newObject)
}

//console.log(service,data);
//removeServiceProfile()

try {
    js.profileProvMBean.removeProfileTable('HNI Profile Table')
} catch (e) {
    console.log(e)
}

try {
    js.profileProvMBean.removeProfileTable('CC Profile Table')
} catch (e) {
    console.log(e)
}

//load('data.json');
updateServiceProfile(service)
hniData.forEach((item)=>updateHniProfile(item))
ccData.forEach((item)=>updateCcProfile(item))
