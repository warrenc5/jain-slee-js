import * as js from '/resource:js/jain-slee.js'

var profileSpecs = js.deploymentMBean.ProfileSpecifications

for (var k in profileSpecs) {
    console.log(profileSpecs[k])
}

var debug = js_debug

export function updateProfile(spec, tableName, profileName, newObject) {
    var profile = js.createProfileTable(spec, tableName, profileName)
    if (profile) {
        //if (debug)
            console.log("before", JSON.stringify(profile))
        profile.editProfile()
        try {
            if (profile.isProfileWriteable) {
                Object.assign(profile, newObject)
            }
        } finally {
            if (profile.isProfileDirty) {
                profile.commitProfile()
            }
        }
        //if (debug)
            console.log("after", JSON.stringify(profile))
    }
}