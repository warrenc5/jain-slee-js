import * as jmx from '/resource:js/mofokom/jain-slee-graal/15-jmx-base.js'
import * as connect from '/resource:js/mofokom/jain-slee-graal/20-connect.js';


const debug = js_debug || false
const trace = js_trace || false

var connected = connect.connect()
const _sleeMBean = jmx.mbean("javax.slee.management:name=SleeManagement", false)
const _resourceAdaptorMBean = jmx.mbean(_sleeMBean.ResourceManagementMBean, false)

var state = javax.slee.management.ResourceAdaptorEntityState.ACTIVE
var raID = new javax.slee.resource.ResourceAdaptorID("me","mine","1.0");
var linkNames = ['a','b','c']

var raEntities = _resourceAdaptorMBean.getResourceAdaptorEntities(state);
//raEntities = _resourceAdaptorMBean.getResourceAdaptorEntities(raID);
raEntities = _resourceAdaptorMBean.getResourceAdaptorEntities(linkNames);
console.log("raEntities: " + raEntities);

/**
 * 
 * 
    op  getResourceAdaptorEntities 1 class java.lang.String[] true undefined
## 0 javax.slee.resource.ResourceAdaptorID
	[1] 0 string javax.slee.resource.ResourceAdaptorID
  op  getResourceAdaptorEntities 1 class javax.slee.resource.ResourceAdaptorID false undefined
# 0 javax.slee.management.ResourceAdaptorEntityState
	[1] 0 string javax.slee.management.ResourceAdaptorEntityState
  op  getResourceAdaptorEntities 1 class javax.slee.management.ResourceAdaptorEntityState false undefined
# 0 java.lang.String
	[1] 0 string java.lang.String
    **/
