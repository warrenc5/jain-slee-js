import {profileProvMBean} from '/resource:js/mofokom/jain-slee-graal/30-mbeans.js'
import {mbean} from '/resource:js/mofokom/jain-slee-graal/15-jmx-base.js'

export const debug = js_debug || false
export const trace = js_trace || false

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
        if(!toArray(profileTables).includes(tableName)) {
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

                profile = toArray(profile).filter(function (p) {
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

export function toString(a) {
    if(!a instanceof Array)
        return a;

    var k = "[";
    for (var s = 0; s < a.length; s++) {
        k += a[s]
        if (s < a.length - 1) {
            k += ', '
        }
    }

    return k += "]"
}

// Java Collection (Iterable) to script array
export function toArray(collection) {
    if (collection instanceof Array) {
        return collection;
    }
    var array = new Array();
    try {
        var itr = collection.iterator();
        while (itr.hasNext()) {
            array.push(itr.next());
        }
    }catch(e) { 
        for (var i = 0; i < collection.length; i++) {
            array.push(collection[i]);
        }
    }

    return array;
}

// wraps a script array as java.lang.Object[]
//FIXME:
export function objectArray(array) {
    if (array === undefined) {
        array = [];
    }
    try {
        if (trace)
            console.log("1!", arrayToString(array))
        var to = Java.to(array, "java.lang.Object[]");
        if (trace)
            console.log("!!", arrayToString(to))
        return to;
    } catch (e) {
        console.log("e1**" + e);
        return Java.to([], "java.lang.Object[]");
    }
}

// wraps a script (string) array as java.lang.String[]
//FIXME:
export function stringArray(array) {
    if (array === undefined) {
        array = [];
    }
    try {
        return Java.to(array, "java.lang.String[]");
    } catch (e) {
        console.log("e2**" + e);
        return Java.to([], "java.lang.String[]");
    }
}

export function arrayToStringShort(o) {
    var result = "[";

    for (var s = 0; s < o.length; s++) {
        result += o[s]
    }
    result += "]"
    return result
}
export function arrayToString(o, pad) {
    if (pad === undefined)
        pad = '';

    if (o === undefined)
        return "[]";
    pad += '\t' + "[" + o.length + "]";

    for (var s = 0; s < o.length; s++) {
        var type = typeof (o[s]);

        var v = o[s];

        try {
            type = o[s].getClass();


            if (type.isArray())
                v = o[s].length;

        } catch (e) {
        }

        console.log(pad + " " + s + " " + type + " " + v);

        if (o[s] == null)
            continue;

        try {
            if (type.isArray()) {
                arrayToString(o[s], pad);
            }
        } catch (e) {
        }
    }
    pad = pad.slice(0, pad.length - 1);
}