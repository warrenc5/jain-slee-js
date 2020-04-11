import {profileMBean} from '/resource:js/mofokom/jain-slee-graal/30-mbeans.js'

export function createProfileTable(spec, tableName, profileName) {

    var profile = null;
    var objectName = "javax.slee.profile:type=Profile,profileTableName=" + tableName + ",profileName=" + profileName;

    try {
        profile = profileMBean.getProfile(tableName, profileName);
    } catch (e) {
        print("profile does not exist ", e, profile);
    }

    if (profile === undefined || profile == null) {
        var a = toArray(profileMBean.ProfileTables);
        print("profileTables", a);

        var k = a.filter(function (n) {
            return n === tableName
        }).shift();

        if (k === undefined) {
            print("creating " + tableName + " " + spec.toString());
            profileMBean.createProfileTable(spec, tableName);
            print("created table " + tableName);
        }

        try {
            var p2 = toArray(profileMBean.getProfiles(tableName));
            print('profiles ', p2);

            profile = p2.filter(function (p) {
                return p.getProfileName() == profileName;
            }).shift();

        } catch (e) {
            print(e);
            //e.printStackTrace();
        }

        if (profile === undefined) {
            print("creating profile in table");
            try {
                profileMBean.createProfile(tableName, profileName);
                profile = objectName;
            } catch (e) {
                print(e);
                //e.printStackTrace();
            }
        }
    }


    if (profile != objectName) {
        print("warn", profile, objectName);
    } else {
        print(profile);
        return mbean(profile);
    }

}

export function toString(a) {
    var k = "["
    for (var s = 0;
    s < a.length; s++) {
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
    var itr = collection.iterator();
    var array = new Array();
    while (itr.hasNext()) {
        array[array.length] = itr.next();
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
        var to = Java.to(array, "java.lang.Object[]");
        return to;
    } catch (e) {
        print("e1**" + e);
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
        print("e2**" + e);
        return Java.to([], "java.lang.String[]");
    }
}