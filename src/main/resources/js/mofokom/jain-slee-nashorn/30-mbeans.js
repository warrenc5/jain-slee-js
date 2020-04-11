var slee = mbean("javax.slee.management:name=SleeManagement", false);
try {
    var sbbMBean = mbean("org.mobicents.slee:name=SbbEntitiesMBean", false);
    var activityMBean = mbean("org.mobicents.slee:name=ActivityManagementMBean", false);
} catch (e) {
    print(e);
}

//Opencloud Rhino specific
try {
    var houseKeepingMBean = mbean("com.opencloud.rhino:type=Housekeeping");
    var node = java.lang.Integer.valueOf(101);
    var nodeHouseKeepingMBean = mbean(houseKeepingMBean.getNodeHousekeeping(node));
} catch (e) {
    print(e);
}

var alarmMBean = mbean(slee.AlarmMBean, false);
var deploymentMBean = mbean(slee.DeploymentMBean, false);
var resourceAdaptorMBean = mbean(slee.ResourceManagementMBean, false);
var profileMBean = mbean(slee.ProfileProvisioningMBean, false);
var serviceMBean = mbean(slee.ServiceManagementMBean, false);
var traceMBean = mbean(slee.TraceMBean, false);
