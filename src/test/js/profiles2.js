import * as js from '/resource:js/jain-slee.js'

var profileSpecs = js.deploymentMBean.ProfileSpecifications

for (var k in profileSpecs) {
  console.log(profileSpecs[k])
}

function updateProfile(spec, tableName, profileName, newObject) {
  var profile = js.createProfileTable(spec, tableName, profileName)
    if (profile) {
      console.log("before",JSON.stringify(profile))
        profile.editProfile()
        try {
          if(profile.isProfileWriteable){
            Object.assign(profile,newObject)
          }
        } finally { 
          if(profile.isProfileDirty){
            profile.commitProfile()
          }
        }
      console.log("after",JSON.stringify(profile))
    }
}

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

function updateServiceProfile() {
  var spec = new javax.slee.profile.ProfileSpecificationID('ServiceConfigProfile', 'fr.orange.in', '0.0.1')
    var tableName = 'CestCa'
    var profileName = 'service'

    var profile = updateProfile(spec, tableName, profileName, newObject)

    var newObject = {ServiceIdentifier : "default service",
      HttpTimeout : 2000,
      MapTimeout : 2000
    }

    updateProfile(spec, tableName, profileName , newObject)
}

function removeHniProfile() {
    var tableName = 'HNI Profile Table'
    var profileName = 'test2'
    try { 
      js.profileProvMBean.removeProfile(tableName, profileName)
    } catch (e) { 
      console.log(e)
    }
}

function updateHniProfile() {
  var spec = new javax.slee.profile.ProfileSpecificationID('HNIProfile', 'fr.orange.in', '0.0.1')
    var tableName = 'HNI Profile Table'
    var profileName = 'test2'
    var newObject = {
      "Hni": "1234", 
      "Mcc":123,
      "Mnc":45,
      "IsoCountry":"cc",
      "CountryCode":"01",
      "Network":"Mofokom",
      "GtPrefix":"98765",
    }
    var profile = updateProfile(spec, tableName, profileName, newObject)
}

//removeServiceProfile()
updateServiceProfile()
try {
  js.profileProvMBean.removeProfileTable('HNI Profile Table')
} catch (e) { 
  console.log (e)
}
updateHniProfile()
