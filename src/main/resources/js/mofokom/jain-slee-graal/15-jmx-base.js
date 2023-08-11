import * as util from '/resource:js/mofokom/jain-slee-graal/40-slee-util.js'

export const debug = js_debug || false
export const trace = js_trace || false

if (debug)
    console.log("debug enabled")
if (trace)
    console.log("trace enabled")

var mmConnection;
export function jmxConnect(hostport, name, username, password) {

    var urlPath = "/jndi/rmi://" + hostport + "/jmxconnector";
    //var urlPath = "rmi://" + hostport + "/opencloud/rhino";
    //service:jmx:rmi:///jndi/rmi://lo:1199/opencloud/rhino
    urlPath = "service:jmx:rmi://" + hostport + "/jndi/rmi://" + hostport + "/" + name;
    //urlPath = "service:jmx:rmi://lo:1199/jndi/opencloud/rhinossl";
    //    service:jmx:rmi://lo:1199/jndi/rmi://lo:1199/jmxconnector

    //    var url = new JMXServiceURL("rmi", "lo", 1199, urlPath);
    return jmxConnectURL(urlPath, username, password);
}

export function jmxConnectURL(urlPath, username, password) {
    const HashMap = Java.type('java.util.HashMap');
    var map = new HashMap();
    var creds = new Array();
    if (username) {
        creds.push(username);
    }
    if (password) {
        creds.push(password);
    }
    map.put('jmx.remote.credentials', util.stringArray(creds));

    if (mmConnection != null) {
        // close the existing connection
        try {
            mmConnection.close();
        } catch (e) {
            console.log(e);
        }
    }
    var JMXServiceURL = javax.management.remote.JMXServiceURL;

    if (urlPath == null)
        throw new Error("no url specified");

    var url = new JMXServiceURL(urlPath);
    if (debug)
        console.log("connecting to " + url.toString());

    var factory = javax.management.remote.JMXConnectorFactory;
    map.put('jmx.remote.protocol.provider.pkgs', 'com.heliosapm.utils.jmx.protocol.local|org.jboss.remotingjmx');
    if (urlPath.startsWith("remote+http")) {
        var RemotingConnectorProvider = org.jboss.remotingjmx.RemotingConnectorProvider;
        factory = new RemotingConnectorProvider();
    }
    try {
        var jmxc = factory.newJMXConnector(url, map);

        if (debug)
            console.log("provider " + jmxc);
        jmxc.connect();
        // note that the "mmConnection" is a global variable!
        mmConnection = jmxc.getMBeanServerConnection();
        if (debug)
            console.log("connection is " + mmConnection);
        return mmConnection;
    } catch (x) {
        console.log("error connecting " + x);
        throw x
    }
}

jmxConnect.docString = "connects to the given host, port (specified as name:port)";

function mbeanConnection() {
    if (mmConnection == null) {
        throw "Not connected to MBeanServer yet!";
    }

    return mmConnection;
}
mbeanConnection.docString = "returns the current MBeanServer connection"

/**
 * Returns a platform MXBean proxy for given MXBean name and interface class
 */
function newPlatformMXBeanProxy(name, intf) {
    var factory = java.lang.management.ManagementFactory;
    return factory.newPlatformMXBeanProxy(mbeanConnection(), name, intf);
}
newPlatformMXBeanProxy.docString = "returns a proxy for a platform MXBean";

/**
 * Wraps a string to ObjectName if needed.
 */
function objectName(objName) {
    if (typeof objName == "string") {
        var on = Java.type("javax.management.ObjectName")
        return new on(objName);
    } else {
        return objName;
    }
}

objectName.docString = "creates JMX ObjectName for a given String";


/**
 * Creates a new (M&M) Attribute object
 *
 * @param name name of the attribute
 * @param value value of the attribute
 */
function attribute(name, value) {
    var Attribute = Packages.javax.management.Attribute;
    return new Attribute(name, value);
}
attribute.docString = "returns a new JMX Attribute using name and value given";

/**
 * Returns MBeanInfo for given ObjectName. Strings are accepted.
 */
function mbeanInfo(objName) {

    objName = objectName(objName);
    return mbeanConnection().getMBeanInfo(objName);
}
mbeanInfo.docString = "returns MBeanInfo of a given ObjectName";

/**
 * Returns ObjectInstance for a given ObjectName.
 */
function objectInstance(objName) {
    objName = objectName(objName);
    return mbeanConnection().objectInstance(objectName);
}
objectInstance.docString = "returns ObjectInstance for a given ObjectName";

/**
 * Queries with given ObjectName and QueryExp.
 * QueryExp may be null.
 *
 * @return set of ObjectNames.
 */
function queryNames(objName, query) {
    objName = objectName(objName);
    if (query == undefined)
        query = null;
    return mbeanConnection().queryNames(objName, query);
}
queryNames.docString = "returns QueryNames using given ObjectName and optional query";


/**
 * Queries with given ObjectName and QueryExp.
 * QueryExp may be null.
 *
 * @return set of ObjectInstances.
 */
function queryMBeans(objName, query) {
    objName = objectName(objName);
    if (query == undefined)
        query = null;
    return mbeanConnection().queryMBeans(objName, query);
}
queryMBeans.docString = "return MBeans using given ObjectName and optional query";



// script array to Java List
function toAttrList(array) {
    var AttributeList = Packages.javax.management.AttributeList;
    if (array instanceof AttributeList) {
        return array;
    }
    var list = new AttributeList(array.length);
    for (var index = 0; index < array.length; index++) {
        list.add(array[index]);
    }
    return list;
}

// gets MBean attributes
function getMBeanAttributes(objName, attributeNames) {
    objName = objectName(objName);
    return mbeanConnection().getAttributes(objName, util.stringArray(attributeNames));
}
getMBeanAttributes.docString = "returns specified Attributes of given ObjectName";

// gets MBean attribute
function getMBeanAttribute(objName, attrName) {
    objName = objectName(objName);
    return mbeanConnection().getAttribute(objName, attrName);
}
getMBeanAttribute.docString = "returns a single Attribute of given ObjectName";

// sets MBean attributes
function setMBeanAttributes(objName, attrList) {
    objName = objectName(objName);
    attrList = toAttrList(attrList);
    return mbeanConnection().setAttributes(objName, attrList);
}
setMBeanAttributes.docString = "sets specified Attributes of given ObjectName";

// sets MBean attribute
function setMBeanAttribute(objName, attrName, attrValue) {
    var Attribute = Packages.javax.management.Attribute;
    objName = objectName(objName);
    if (debug)
        console.log(objName, attrName, attrValue)
    try {
        mbeanConnection().setAttribute(objName, new Attribute(attrName, attrValue));
    } catch (e) {
        if (trace)
            console.log("failed set", objName, attrName, attrValue, e)
    }
    if (trace)
        console.log("setted", objName, attrName, attrValue)
}
setMBeanAttribute.docString = "sets a single Attribute of given ObjectName";


// invokes an operation on given MBean
function invokeMBean(objName, operation, params, signature) {
    objName = objectName(objName);
    params = util.objectArray(params);
    signature = util.stringArray(signature);
    var res;
    try {

        if (debug) {
            console.log(objName, operation, signature, " > ", params);
        }

        res = mbeanConnection().invoke(objName, operation, params, signature);

        if (debug)
            console.log(objName, operation, params, " => result:", res);

    } catch (x) {
        if (debug) {
            console.log(x, objName, operation, " < ", params, signature);
        }
        console.log(x, typeof x)

        throw x;
    }
    return res;
}

invokeMBean.docString = "invokes MBean operation on given ObjectName";

function Info(objName) {

    try {
        this.objName = objName

        if (debug)
            console.log("getting info", objName);

        this.info = mbeanInfo(objName);

        if (trace)
            console.log("info ", this.info);


        this.attrMap = new Object()

        var attrs = this.info.getAttributes();

        if (trace)
            console.log("attrs ", attrs);

        for (var index in attrs) {
            if (trace)
                console.log("  attr " + attrs[index].getName());

            try {
                Java.type(stripArray(attrs[index].getType()))
            } catch(e){ 
                console.log("warn",e)
            }
            this.attrMap[attrs[index].getName()] = attrs[index].getName();
        }

        if (debug)
            console.log("get operations")

        this.opers = this.info.getOperations();

        if (trace)
            console.log("operations ", this.opers)

        this.operMapNames = {}
        this.operResMap = {}

        for (var index in this.opers) {
            operMeta.call(this, index, this.opers)
        }
    } catch (e) {
        console.log(e)
        throw e
    }

}

Info.prototype.isAttribute = function (name) {
    return name in this.attrMap;
}

Info.prototype.isOperation = function (name) {
    return name in this.operMapNames;
}

/**
 * Wraps a MBean specified by ObjectName as a convenient
 * script object -- so that setting/getting MBean attributes
 * and invoking MBean method can be done with natural syntax.
 *
 * @param objName ObjectName of the MBean
 * @param async asynchornous mode [optional, default is false]
 * @return script wrapper for MBean
 *
 * With async mode, all field, operation access is async. Results
 * will be of type FutureTask. When you need value, call 'get' on it.
 */
export function mbean(objNameString, async) {
    if (debug)
        console.log("creating mbean for " + objNameString)

    if (objNameString === undefined) {
        console.log("was null")
        return null
    }

    var objName = objectName(objNameString);

    if (debug)
        console.log("object-name " + objName);

    try {
        var info = mbeanInfo(objName);
    } catch (e) {
        if (debug)
            console.log("error getting info", e);
        throw e
    }

    if (info == null) {
        console.log("no info ", objName);
        return null;
    }

    return new Proxy(new Info(objName), {
        //https://blogs.oracle.com/sundararajan/encapsulation-in-javascript
        //https://blogs.oracle.com/sundararajan/self%2c-javascript-and-jsadapter
        has: function (target, name, receiver) {
            //if (debug)
            console.log("has " + name);
            return target.isAttribute(name) || target.isOperation(name);
        },
        get: function (target, name, receiver) {

            if (name === Symbol.toPrimitive) {
                return (hint) => {
                    if (hint === "string")
                        return objName.toString();
                    else if (hint === "number")
                        return 0;
                    else
                        return null;
                };
            }

            if (debug)
                console.log("get", name);

            var m = target.isAttribute(name.replace(/^is/, ""));


            if (name !== "toString" && (target.isAttribute(name) || m)) {
                if (m) {
                    name = name.replace(/^is/, "");
                }

                if (debug) {
                    console.log("attribute " + name);
                }

                if (async) {
                    return getMBeanAttribute.future(target.objName, name);
                } else {
                    if (debug)
                        console.log(target.objName)
                    return getMBeanAttribute(target.objName, name);
                }
            } else if (name === "info") {
                return info
            } else if (name === "_ALL_") {
                return Object.keys(target.attrMap).map(n => n);
            } else if (name === "objName") {
                return objName
            } else if (name === "toJSON" || name === "toString" || name === "help" || target.isOperation(name)) {
                if (debug)
                    console.log("op", name);
                var blank = function () {
                    return {name: name, info: target}
                }

                if (name === "toString") {
                    return objName;
                }

//TODO reuse proxies
                return new Proxy(blank, {

                    apply: function (target, _this, args) {

                        var name = target().name
                        if (debug)
                            console.log("applying ", name, args.length, util.toString(args))

                        //TODO move out of proxy - like toString
                        if (name === "toJSON") {
                            try {
                                var k = Object.keys(target().info.attrMap).sort()
                                var o = {}
                                for (const e of k) {
                                    var v = getMBeanAttribute(target().info.objName, e);
                                    o[e] = v
                                }

                                return o;
                            } catch (e) {
                                console.log("toJSON error",e)
                            }
                        } else if (name === "help") {
                            console.log("help: " + objName);
                            console.log("  attributes:");
                            for (const k of Object.keys(target().info.attrMap).sort()) {
                                console.log("  - " + k);
                            }
                            console.log("  operations:"); //TODO: use lambdas on info.opers
                            for (const k of Object.keys(target().info.operMapNames).sort()) {
                                console.log("  - " + k + " = " + target().info.operResMap[k]);
                                if (target().info.operMapNames[k].length > 0)
                                    console.log("      " + target().info.operMapNames[k]);
                            }
                        } else if (target().info.isOperation(name)) {
                            if (trace)
                                console.log("operation " + name);

                            return invokeOper.call(target().info, name, args)
                        } else {
                            if (debug)
                                console.log(name," not found");
                            return undefined;
                        }
                    }
                })
            } else {
                if (debug)
                    console.log(name, "not found");
                //throw new Error("not found " + name);
                return undefined;
            }
        },

        set: function (target, name, value, receiver) {
            if (debug)
                console.log("set", name, value, async)
            if (target.isAttribute(name)) {
                if (async) {
                    setMBeanAttribute.future(objName, name, value);
                } else {
                    setMBeanAttribute(objName, name, value);
                }
                return true;
            } else {
                console.log("warning " + name + "not found");
            }
            return false;
        }
    });
}

function allArgs(args, sig) {
    for (var s = 0;
    s < args.length; s++) {
        var sigType = sig[s].getType()
        var sigArray = sigType.startsWith("[L") && sigType.endsWith(";")
        var isArray = Array.isArray(args[s])
        if (isArray) {
            if (trace)
                console.log("typeof", typeof args[s], isArray)
            if (sigArray) {
                //TODO: match elements
                continue;
            }
        } else {

            if (typeof args[s] === "object") {
                var type = args[s].getClass();
                if (type.isArray() && sigArray) {
                    if (trace)
                        console.log("array", type, sigType)
                    //TODO: match elements
                } else {
                    if (trace)
                        if (trace)
                            console.log("object", type, sigType)
                    if (type.getName() != sigType) {
                        return false
                    }
                }
            } else {
                if (trace)
                    console.log("here")
            }

        }
    }
    return true
}

function invokeOper(name, args) {

    var oper = this.opers.filter(o => name == o.getName() && args.length == o.getSignature().length
                && allArgs(args, o.getSignature()))

    if (debug)
        console.log("calling", oper[0]);
    var sigNames = oper[0].getSignature().map(s => s.getType())


    return invokeMBean(this.objName, name, args, sigNames);

    //if (async) {
    //    return invokeMBean.future(objName, name, args, sigNames);
    //} else {
    //}
}

function operMeta(index, opers) {
    var k = 0;

    try {
        k = opers[index].getSignature().length;
    } catch (x) {
    }

    var sig = new Array();
    var v = '';
    var t = '';
    if (k != 0)
        for (var s in opers[index].getSignature()) {
            try {
                sig[s] = opers[index].getSignature()[s].getType();
                Java.type(stripArray(sig[s]))
                if (trace)
                    console.log("#", s, sig[s])
                var type = Java.type('java.lang.Class').forName(sig[s]);
                t += type;
                if (type.isArray())
                    v += 'true';
                else
                    v += 'false';

            } catch (x) {
                v += 'false';
            }
        }

    if (trace)
        console.log("  op ", opers[index].getName(), k, t, v, util.arrayToString(sig));// + ((k>0)? opers[index].signature[0].toString():null));

    //arrayToString(sig);

//FIXME: return types for overloaded methods 
    this.operResMap[opers[index].getName()] = opers[index].getReturnType();
    this.operMapNames[opers[index].getName()] = sig;
}

function stripArray(v) {
    return v.replace(/^\[L/, "").replace(/;/, "")
}
