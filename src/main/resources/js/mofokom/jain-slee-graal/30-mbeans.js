import * as jmx from '/resource:js/mofokom/jain-slee-graal/15-jmx-base.js'
import * as connect from '/resource:js/mofokom/jain-slee-graal/20-connect.js'

connect.connect();

export const sleeMBean = jmx.mbean("javax.slee.management:name=SleeManagement", false)
//sleeMBean.stop()
//Mobicents specific
export const sbbMBean = jmx.mbean("org.mobicents.slee:name=SbbEntitiesMBean", false)
export const activityMBean = jmx.mbean("org.mobicents.slee:name=ActivityManagementMBean", false)

//Opencloud Rhino specific
export const houseKeepingMBean = jmx.mbean("com.opencloud.rhino:type=Housekeeping")
var node = java.lang.Integer.valueOf(101)
export const nodeHouseKeepingMBean = (houseKeepingMBean == null) ? null : jmx.mbean(houseKeepingMBean.getNodeHousekeeping(node))

export const alarmMBean = jmx.mbean(sleeMBean.AlarmMBean, false)
export const deploymentMBean = jmx.mbean(sleeMBean.DeploymentMBean, false)
export const resourceAdaptorMBean = jmx.mbean(sleeMBean.ResourceManagementMBean, false)
export const profileMBean = jmx.mbean(sleeMBean.ProfileProvisioningMBean, false)
export const serviceMBean = jmx.mbean(sleeMBean.ServiceManagementMBean, false)
export const traceMBean = jmx.mbean(sleeMBean.TraceMBean, false)

//print(traceMBean.getTraceLevel(new javax.slee.SbbID("name","vendor","version")))