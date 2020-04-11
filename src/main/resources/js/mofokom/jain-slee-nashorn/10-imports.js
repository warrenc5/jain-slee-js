//Packages.javax.slee;
print("JAIN SLEE JMX Javascript Routines");
try {
    var CollectionsAndFiles = new JavaImporter(
            java.lang,
            java.util,
            java.lang.reflect,
            javax.slee.service.ServiceID,
            javax.slee.management.DeployableUnitID,
            javax.slee,
            javax.slee.profile,
            javax.slee.management,
            javax.slee.resource,
            javax.slee.resource.ConfigProperty,
            org.mobicents.slee.container.activity,
            org.mobicents.slee.runtime.facilities.profile);

    /**
     load("nashorn:mozilla_compat.js");
     importPackage(java.lang.reflect);
     
     importPackage(javax.slee.service.ServiceID);
     importPackage(javax.slee.management.DeployableUnitID);
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
     **/

    print("loaded packages");
} catch (e) {
    print(e);
}