import * as jmx from '/resource:js/mofokom/jain-slee-graal/15-jmx-base.js'
import * as connect from '/resource:js/mofokom/jain-slee-graal/20-connect.js';

var _sleeMBean
var _sbbMBean
var _activityMBean

//Opencloud Rhino specific
var _houseKeepingMBean
var _node
var _nodeHouseKeepingMBean

var _alarmMBean
var _deploymentMBean
var _resourceAdaptorMBean
var _profileProvMBean
var _serviceMBean
var _traceMBean

export const debug = js_debug || false
export const trace = js_trace || false

try {
    var connected = connect.connect()
    if (debug)
        print("is connected", connected)
    if (connected) {

        _sleeMBean = jmx.mbean("javax.slee.management:name=SleeManagement", false)
//Mobicents specific
        try {
            _sbbMBean = jmx.mbean("org.mobicents.slee:name=SbbEntitiesMBean", false)
            _activityMBean = jmx.mbean("org.mobicents.slee:name=ActivityManagementMBean", false)
        } catch (e) {
            if (debug) {
                console.log("not mobicents")
                if (trace)
                    console.log(e);
            }
        }

//Opencloud Rhino specific
        try {
            _houseKeepingMBean = jmx.mbean("com.opencloud.rhino:type=Housekeeping")
            _node = java.lang.Integer.valueOf(101)
            if (debug) {
                print("returned " + houseKeepingMBean)
            }
            _nodeHouseKeepingMBean = (houseKeepingMBean == null) ? null : jmx.mbean(houseKeepingMBean.getNodeHousekeeping(node))
        } catch (e) {
            if (debug) {
                console.log("not opencloud")
                if (trace)
                    console.log(e);
            }
        }

        _alarmMBean = jmx.mbean(_sleeMBean.AlarmMBean, false)
        _deploymentMBean = jmx.mbean(_sleeMBean.DeploymentMBean, false)
        _resourceAdaptorMBean = jmx.mbean(_sleeMBean.ResourceManagementMBean, false)
        _profileProvMBean = jmx.mbean(_sleeMBean.ProfileProvisioningMBean, false)
        _serviceMBean = jmx.mbean(_sleeMBean.ServiceManagementMBean, false)
        _traceMBean = jmx.mbean(_sleeMBean.TraceMBean, false)
    } else {
        if (debug) {
            print("no mbean server connection ");
        }
        throw "not connected to mbean server"
    }

} catch (e) {
    print("error loading mbeans")
    throw e
}

//print(traceMBean.getTraceLevel(new javax.slee.SbbID("name","vendor","version")))


export const sleeMBean = _sleeMBean
//sleeMBean.stop()
//Mobicents specific
export const sbbMBean = _sbbMBean
export const activityMBean = _activityMBean

//Opencloud Rhino specific
export const houseKeepingMBean = _houseKeepingMBean == null ? {} : _houseKeepingMBean
export const houseKeepingNode = _node
export const nodeHouseKeepingMBean = _nodeHouseKeepingMBean == null ? {} : _nodeHouseKeepingMBean

export const alarmMBean = _alarmMBean
export const deploymentMBean = _deploymentMBean
export const resourceAdaptorMBean = _resourceAdaptorMBean
export const profileProvMBean = _profileProvMBean
export const serviceMBean = _serviceMBean
export const traceMBean = _traceMBean
export const mbean = jmx.mbean 