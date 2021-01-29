import * as js from '/resource:js/jain-slee.js';
import * as util from '/resource:js/mofokom/jain-slee-graal/40-slee-util.js'

var activityMBean = js.mbean("org.mobicents.slee:name=ActivityManagementMBean")
var congestionControlMBean = js.mbean("org.mobicents.slee:name=CongestionControlConfiguration")
var deployerMBean = js.mbean("org.mobicents.slee:name=DeployerMBean")
var eventContextMBean = js.mbean("org.mobicents.slee:name=EventContextFactoryConfiguration")
var eventRouterMBean = js.mbean("org.mobicents.slee:name=EventRouterConfiguration")
var eventRouterStatisticsMBean = js.mbean("org.mobicents.slee:name=EventRouterStatistics")
var mobicentsMBean = js.mbean("org.mobicents.slee:service=MobicentsManagement")
var policyMBean = js.mbean("org.mobicents.slee:name=PolicyManagementMBean")
var profileObjectMBean = js.mbean("org.mobicents.slee:service=ProfileObjectPoolManagement")
var sbbEntityMBean = js.mbean("org.mobicents.slee:name=SbbEntitiesMBean")
var sbbObjectMBean = js.mbean("org.mobicents.slee:service=SbbObjectPoolManagement")
var timerMBean = js.mbean("org.mobicents.slee:name=TimerFacilityConfiguration")
