print("test ")
print("Java " + Object.keys(Java))
var a = Java.to([], "java.lang.String[]")
print(a)

import * as jmx from '/resource:js/mofokom/jain-slee-graal/15-jmx-base.js'

        var b = jmx.objectArray([])
print(b)

import * as js from '/resource:js/jain-slee.js';
var contexts = new Array();//java.lang.reflect.Array.newInstance(org.mobicents.slee.container.activity.ActivityContextHandle, 100);
contexts = js.activityMBean.listActivityContexts(true);
print("activities : " + (contexts === null ? null : contexts.length));