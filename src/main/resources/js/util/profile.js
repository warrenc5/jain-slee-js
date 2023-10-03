import {deploymentMBean, profileProvMBean} from '/resource:js/mofokom/jain-slee-graal/30-mbeans.js'
import {mbean} from '/resource:js/mofokom/jain-slee-graal/15-jmx-base.js'
import * as util from '/resource:js/mofokom/jain-slee-graal/40-slee-util.js'

var debug = js_debug

export function listProfiles() { 
    var profileSpecs = deploymentMBean.ProfileSpecifications
    for (var k in profileSpecs) {
        console.log(profileSpecs[k]);
    }
    return profileSpecs;
}


export function updateProfile(spec, tableName, profileName, newObject) {
    var profile = createProfileTable(spec, tableName, profileName);
    if (profile) {
        console.log("before", JSON.stringify(profile));
        profile.editProfile();
        try {
            if (profile.isProfileWriteable) {
                Object.assign(profile, newObject);
            }
        } finally {
            if (profile.isProfileDirty) {
                profile.commitProfile();
            }
        }
        console.log("after", JSON.stringify(profile));
    }
}
export function createProfileTable(spec, tableName, profileName) {

    var profile = null;
    var objectName = "javax.slee.profile:type=Profile,profileTableName=" + tableName + ",profileName=" + profileName;

    try {
        profile = profileProvMBean.getProfile(tableName, profileName);
    } catch (e) {
        console.log("profile does not exist ", e, ", objectName:", objectName, ", tableName:", tableName, ", profileName:", profileName);
    }

    if (profile === undefined || profile === null) {
        var profileTables = profileProvMBean.ProfileTables;
        if (debug)
            console.log("profileTables:", profileTables);
        if(!util.toArray(profileTables).includes(tableName)) {
            console.log("creating " + tableName + " " + spec.toString());
            try {
                profileProvMBean.createProfileTable(spec, tableName);
                console.log("created table " + tableName);
            } catch (e) {
                console.log("error creating table: ", spec, tableName, e)
                throw e;
            }
        } else {
            if(debug)
                console.log("found table", tableName)
        }

/**FIXME: 
 * error getting info TypeError: invokeMember (getMBeanInfo) on org.jboss.remotingjmx.protocol.v2.ClientConnection$TheConnection@2b5825fa failed due to: Cannot convert '[]'(language: JavaScript, type: Array) to Java type 'javax.management.ObjectName': Unsupported target type.

        if (debug) {
            try {
                var profile = profileProvMBean.getProfiles(tableName) //deprecated
                console.log('profiles ', profile);

                profile = util.toArray(profile).filter(function (p) {
                    return p.getProfileName() == profileName;
                });

            } catch (e) {
                console.log(e);
            }
        }

*/
        try {
            profile = profileProvMBean.getProfile(tableName, profileName)
        } catch (e) {
            console.log("can't get profile", e);
        }
        if (profile == null || profile === undefined) {
            console.log("creating profile in table");
            try {
                profile = profileProvMBean.createProfile(tableName, profileName);
            } catch (e) {
                console.log("error ", e)
                console.log("error creating profile in table ", tableName, profileName, e);
                console.log(e.stack);
                throw e;
            }
        }
    }

    if (profile === undefined) {
        if (debug)
            console.log("no profile, sorry", tableName, profileName);
        return;
    }
    var profileMBean;

    if (profile.toString() !== objectName.toString()) {
        if (debug)
            console.log("profile doesnt match objectName\nprofile:", profile, "\nobjectName:", objectName);
        profileMBean = mbean(profile);
    } else {
        if (debug)
            console.log(profile);
        profileMBean = mbean(profile);
    }

//FIXME - augment proxy
    /*
     if (profileMBean !== null && profileMBean !== undefined) {
     profileMBean.deleteProfile = function () {
     console.log("removing ", tableName, profileName);
     profileProvMBean.removeProfile(tableName, profileName);
     };
     }
     */

    return profileMBean;
}