function createProfileTable(spec, tableName, profileName) {

    var profile = null;
    var objectName = "javax.slee.profile:type=Profile,profileTableName=" + tableName + ",profileName=" + profileName;

    try {
        profile = profileMBean.getProfile(tableName, profileName);
    } catch (e) {
        print("quick check - profile does not exist ", e, profile);
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
function toString(a) {
    var k = "["
    for (var s = 0; s < a.length; s++) {
        k += a[s] + ", "
    }

    return k += "]"
}

