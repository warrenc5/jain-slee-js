function createProfileTable(spec, tableName, profileName) {
    var v = mbean("javax.slee.management:name=ProfileProvisioning", false);

    try {
        var p = Packages.javax.management.ObjectName;
        p = v.getProfile(tableName, profileName);
        print("object: " + p);
        if (p != undefined) {
            return mbean(p.toString());
        }
    } catch (e) {
        print("profile does not exist " + e.toString())
    }

    var a = toArray(v.ProfileTables);
    print("profiles: " + a);

    if (!match(a, "^" + tableName + "$")) {
        try {
            print("creating " + tableName + " " + spec.toString());
            v.createProfileTable(spec, tableName);

            print("created " + tableName);
        } catch (e) {
            print(e);
            return null;
        }
    } else {
        print("found " + tableName);
    }

    var p2 = Packages.java.util.Collection
    var found = false

    try {
        p2 = toArray(v.getProfiles(tableName));
        print("profile: " + p2);

        for (var s = 0; s < p2.length; s++) {
            print("profile: " + p2[s].getProfileName());
            if (p2[s].getProfileName() == profileName) {
                found = true;
            }
        }
    } catch (e) {
        print(e);
    }

    if (!found) {
        v.createProfile(tableName, profileName);
    }

    try {
        var v2 = mbean("javax.slee.profile:type=Profile,profileTableName=" + tableName + ",profileName=" + profileName);
        print(v2);
    } catch (e) {
        print(e);
    }

    return v2;

}
function toString(a) {
    var k = "["
    for (var s = 0; s < a.length; s++) {
        k += a[s] + ", "
    }

    return k += "]"
}

