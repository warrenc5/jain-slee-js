import * as util from '/resource:js/mofokom/jain-slee-graal/40-slee-util.js'

export const debug = true;
export const trace = false;

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
    var map = new java.util.HashMap();
    var creds = new Array();
    if (username) {
        creds.push(username);
    }
    if (password) {
        creds.push(password);
    }
    map.put('jmx.remote.credentials', util.stringArray(creds));
    //map.put('jmx.remote.protocol.provider.pkgs','org.jboss.remotingjmx');

    if (mmConnection != null) {
        // close the existing connection
        try {
            mmConnection.close();
        } catch (e) {
            print(e);
        }
    }
    var JMXServiceURL = javax.management.remote.JMXServiceURL;

    if (urlPath == null)
        throw new Error("no url specified");

    var url = new JMXServiceURL(urlPath);
    print("connecting to " + url.toString());

    var factory = javax.management.remote.JMXConnectorFactory;
    var jboss = new org.jboss.remotingjmx.RemotingConnectorProvider;
    try {
        var jmxc = jboss.newJMXConnector(url, map);
        print("provider " + jmxc);
        jmxc.connect();
        // note that the "mmConnection" is a global variable!
        mmConnection = jmxc.getMBeanServerConnection();
        print("connected to " + mmConnection);
    } catch (x) {
        print("error connecting " + x);
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
    mbeanConnection().setAttribute(objName, new Attribute(attrName, attrValue));
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
            print(objName, operation, params, util.arrayToStringShort(params), util.arrayToStringShort(signature), " > ");
        }

        res = mbeanConnection().invoke(objName, operation, params, signature);
        if (debug)
            print(objName, operation, util.arrayToStringShort(params), " = ", res);

    } catch (x) {
        if (debug) {
            print(x, objName, operation, " < ");
            util.arrayToString(params);
            util.arrayToString(signature);
        }
        print(x, x.getMessage(), typeof x)

        throw x;
    }
    return res;
}

invokeMBean.docString = "invokes MBean operation on given ObjectName";

function Info(objName) {

    try {
        this.objName = objName
        this.info = mbeanInfo(objName);

        if (debug)
            print("constructor called " + objName);

        this.attrMap = new Object()

        var attrs = this.info.getAttributes();
        for (var index in attrs) {
            if (debug)
                print("  attr " + attrs[index].getName());
            
            Java.type(attrs[index].getType().replace(/^\[L/,""))
            this.attrMap[attrs[index].getName()] = attrs[index].getName();
        }

        print("operations ")
        var opers = this.info.getOperations();

        this.operMap = {}
        this.operTypeMap = {}
        this.operMapNames = {}

        for (var index in opers) {
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
                        Java.type(sig[s].replace(/^\[L/,""))
                        if (trace)
                            print("#", s, sig[s])
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

            if (debug)
                print("  op ", opers[index].getName(), k, t, v, util.arrayToString(sig));// + ((k>0)? opers[index].signature[0].toString():null));

            //arrayToString(sig);

            this.operMapNames[opers[index].getName()] = sig;
            this.operMap[opers[index].getName() + " " + k] = opers[index];
            this.operTypeMap[opers[index].getName() + k + " " + v] = sig;
        }
    } catch (e) {
        print(e)
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
        print("creating mbean for " + objNameString)

    if (objNameString === undefined) {
        print("was null")
        return null
    }

    var objName = objectName(objNameString);

    if (debug)
        print("object " + objName);

    try {
        var info = mbeanInfo(objName);
    } catch (e) {
        print(e);
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
            if (debug)
                print("get " + name);
            if (target.isAttribute(name)) {
                if (debug)
                    print("attribute " + name);
                if (async) {
                    return getMBeanAttribute.future(target.objName, name);
                } else {
                    if (debug)
                        print(target.objName)
                    return getMBeanAttribute(target.objName, name);
                }
            } else if (target.isOperation(name)) {
                var blank = function () {
                    return {name: name, info: target}
                }

                return new Proxy(blank, {

                    apply: function (target, thisArg, argumentList) {
                        if (debug)
                            print("calling " + target().name)

                        var args = argumentList
                        var name = target().name

                        var r = " " + args.length + " [";
                        for (var i = 0; i < args.length; i++) {
                            r += args[i] + ",";
                        }
                        r += "]";

                        if (debug)
                            print("call " + name + " " + r);

                        if (name == "help") {
                            print("help: " + objName);
                            print("  attributes:");
                            for (var k in target.attrMap) {
                                print("  - " + k);
                            }
                            print("  operations:");
                            if (trace)
                                for (var k in target.operMapNames) {
                                    print("  - " + k);
                                    print("      " + target.operMapNames[k]);
                                }
                        } else if (target().info.isOperation(name)) {
                            if (debug)
                                print("operation " + name);

                            //var params = util.objectArray(args);
                            var k = 0;
                            var v = '';
                            try {
                                k = args.length;
                                for (var s = 0; s < args.length; s++) {
                                    try {
                                        //FIXME
                                        if (typeof args[s] == "object") {
                                            var type = args[s].getClass();

                                            if (type.isArray())
                                                v += 'true';
                                            else
                                                v += 'false';
                                        } else {
                                            v += 'false'
                                        }
                                    } catch (x) {
                                        v += 'false';
                                        if (debug)
                                            print(x);
                                    }
                                }
                            } catch (x) {
                                print(x);
                            }

                            if (trace)
                                print("**" + name + "::" + k + "::" + v);
                            var oper = target().info.operMap[name + "" + k];
                            var sigNames = target().info.operTypeMap[name + k + " " + v];//.signature;
                            if (trace)
                                print("***" + name + "::" + k + "::" + args + " " + sigNames);

                            if (sigNames === undefined)
                                sigNames == "";

                            if (async) {
                                return invokeMBean.future(objName, name, args, sigNames);
                            } else {
                                return invokeMBean(objName, name, args, sigNames);
                            }
                        } else {
                            if (debug)
                                print(name + " " + k + " " + v + " not found");
                            return undefined;
                        }
                    }
                })
            } else {
                if (debug)
                    print(name, "not found");
                //print(name + " " + k + " " + v + " not found");
                return undefined;
            }
        },

        set: function (target, name, value, receiver) {
            print("set")
            if (target.isAttribute(name)) {
                if (async) {
                    setMBeanAttribute.future(objName, name, value);
                } else {
                    setMBeanAttribute(objName, name, value);
                }
            } else {
                if (debug)
                    print(name + "not found");
                return undefined;
            }
        }
    });

}
