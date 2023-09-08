import * as js from '/resource:js/jain-slee.js'

        js.profileProvMBean.help()
var profileSpecs = js.deploymentMBean.ProfileSpecifications
console.log(profileSpecs)
for (var k in profileSpecs) {
    console.log(profileSpecs[k])
    var tables = js.profileProvMBean.getProfileTables(profileSpecs[k]);
    console.log(tables)
    var ta = Array.from(tables)
    for (var t in ta) {
        console.log(t, ta[t])
        var profiles = js.profileProvMBean.getProfiles(ta[t])
        var pa = Array.from(profiles)

        for (var p in pa) {
            console.log(p,pa[p])
            var profileObjectName = js.profileProvMBean.getProfile(pa[p].getProfileTableName(), pa[p].getProfileName())
            var profileMBean = js.mbean(profileObjectName)
            console.log(JSON.stringify(profileMBean));
        }
    }
}
