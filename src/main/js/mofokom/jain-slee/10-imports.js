Packages.javax.slee;
print("JAIN SLEE JMX Javascript Routines");
try {
    load("nashorn:mozilla_compat.js");
    importPackage(java.util);
    importPackage(java.lang.reflect);

    importPackage(javax.slee.service.ServiceID);
    importPackage(javax.slee);
    importPackage(javax.slee.profile);
    importPackage(javax.slee.management);
    importPackage(javax.slee.resource);
    importPackage(javax.slee.resource.ConfigProperty);

    try {
        importPackage(org.mobicents.slee.container.activity);
        importPackage(org.mobicents.slee.runtime.facilities.profile);
        print("mobicents on classpath");
    } catch (e) {
        print("mobicents not on classpath " + e);
    }

    print("loaded packages");
} catch (e) {
    print(e);
}