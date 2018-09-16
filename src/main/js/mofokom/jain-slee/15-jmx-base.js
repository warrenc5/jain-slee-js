function jmxConnect(hostport, name, username, password) {

    var urlPath = "/jndi/rmi://" + hostport + "/jmxconnector";
    //var urlPath = "rmi://" + hostport + "/opencloud/rhino";
    //service:jmx:rmi:///jndi/rmi://lo:1199/opencloud/rhino
    urlPath = "service:jmx:rmi://" + hostport + "/jndi/rmi://" + hostport + "/" + name;
    //urlPath = "service:jmx:rmi://lo:1199/jndi/opencloud/rhinossl";
//    service:jmx:rmi://lo:1199/jndi/rmi://lo:1199/jmxconnector

//    var url = new JMXServiceURL("rmi", "lo", 1199, urlPath);
    return jmxConnectURL(urlPath, username, password);
}

function jmxConnectURL(urlPath, username, password) {
    var map = new java.util.HashMap();
    var creds = new Array();
    if (username) {
        creds.push(username);
    }
    if (password) {
        creds.push(password);
    }
    map.put('jmx.remote.credentials', stringArray(creds));
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
        x.printStackTrace();
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
    var ObjectName = Packages.javax.management.ObjectName;
    if (objName instanceof ObjectName) {
        return objName;
    } else {
        return new ObjectName(objName);
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

// wraps a script array as java.lang.Object[]
function objectArray(array) {
    if (array === undefined) {
        array = [];
    }
    try {
        to = Java.to(array, "java.lang.Object[]");
        return to;
    } catch (e) {
        print(e);
        return Java.to([], "java.lang.Object[]");
    }
}

// wraps a script (string) array as java.lang.String[]
function stringArray(array) {
    if (array === undefined) {
        array = [];
    }
    return Java.to(array, "java.lang.String[]");
}

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

// Java Collection (Iterable) to script array
function toArray(collection) {
    if (collection instanceof Array) {
        return collection;
    }
    var itr = collection.iterator();
    var array = new Array();
    while (itr.hasNext()) {
        array[array.length] = itr.next();
    }
    return array;
}

// gets MBean attributes
function getMBeanAttributes(objName, attributeNames) {
    objName = objectName(objName);
    return mbeanConnection().getAttributes(objName, stringArray(attributeNames));
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
    params = objectArray(params);
    signature = stringArray(signature);
    var res;
    try {
        res = mbeanConnection().invoke(objName, operation, params, signature);
        if (debug)
            print(objName + " " + operation + " > " + res);

    } catch (x) {
        if (debug)
            print(objName + " " + operation + " < ");
        arrayToString(params);
        arrayToString(signature);
        throw x;
    }
    return res;
}
invokeMBean.docString = "invokes MBean operation on given ObjectName";

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
function mbean(objName, async) {
    objName = objectName(objName);
    if (debug)
        print("object " + objName);
    var info = mbeanInfo(objName);
    var attrs = info.attributes;
    var attrMap = new Object;
    for (var index in attrs) {
        if (debug)
            print("  attr " + attrs[index].name);
        attrMap[attrs[index].name] = attrs[index];
    }
    var opers = info.operations;
    var operMap = new Object;
    var operTypeMap = new Object;
    var operMapNames = new Object;

    for (var index in opers) {
        var k = 0;

        try {
            k = opers[index].signature.length;
        } catch (x) {
        }

        var sig = new Array();
        var v = '';
        var t ='';
        if (k != 0)
            for (var s = 0; s < opers[index].signature.length; s++) {
                try {
                    sig[s] = opers[index].signature[s].type;
                    type = java.lang.Class.forName(sig[s]);
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
            print("  op " + opers[index].name + " " + k + " " + t +" "+ v + " ");// + ((k>0)? opers[index].signature[0].toString():null));

        //arrayToString(sig);

        operMapNames[opers[index].name] = sig;
        operMap[opers[index].name+ " " + k] = opers[index];
        operTypeMap[opers[index].name + k + " " + v] = sig;
    }

    function isAttribute(name) {
        return name in attrMap;
    }

    function isOperation(name) {
        return name in operMapNames;
    }
//https://blogs.oracle.com/sundararajan/encapsulation-in-javascript
//https://blogs.oracle.com/sundararajan/self%2c-javascript-and-jsadapter
    return new JSAdapter() {

        __has__: function (name) {
            if (debug)
                print("has " + name);
            return isAttribute(name) || isOperation(name);
        },
        __get__: function (name) {
            if (debug)
                print("get " + name);
            if (isAttribute(name)) {
                if (debug)
                    print("attribute " + name);
                if (async) {
                    return getMBeanAttribute.future(objName, name);
                } else {
                    return getMBeanAttribute(objName, name);
                }
            } else {
                if (debug)
                    print(name + " " + k + " " + v + " not found");
                return undefined;
            }
        },
        __call__: function () {

            var args = Array.prototype.slice.call(arguments);
            var name = args.shift();

            var r = " " + args.length + " [";
            for (var i = 0; i < args.length; i++) {
                r += args[i] + ",";
            }
            r += "]";

            if (debug)
                print("call " + name + " " + r);

            if(name == "help") {
                print("help: " + objName);
                print("  attributes:");
                for (var k in attrMap) {
                    print("  - " +k);
                }
                print("  operations:");
                for (var k in operMapNames) {
                    print("  - " + k );
                    print("      " + operMapNames[k]);
                }
            } else if (isOperation(name)) {
                if (debug)
                    print("operation " + name);

                //var params = objectArray(args);
                var k = 0;
                var v = '';
                try {
                    k = args.length;
                    for (var s = 0; s < args.length; s++) {
                        try {
                            type = args[s].getClass();

                            if (type.isArray())
                                v += 'true';
                            else
                                v += 'false';
                        } catch (x) {
                            v += 'false';
                            print(x);
                        }
                    }
                } catch (x) {
                    print(x);
                }

                if (debug)
                    print("**" + name + "::" + k + "::" + v);
                var oper = operMap[name + ""+ k];
                var sigNames = operTypeMap[name + k + " " + v];//.signature;
                if (debug)
                    print("***" + name + "::" + k + "::" + args + " " + sigNames);

                if (sigNames === undefined)
                    sigNames == "";
                arrayToString(sigNames);

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
        },

        __put__: function (name, value) {
            if (isAttribute(name)) {
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
    };
}

mbean.docString = "returns a conveninent script wrapper for a MBean of given ObjectName";

if (this.application != undefined) {
    this.application.addTool("JMX Connect",
            // connect to a JMX MBean Server 
                    function () {
                        var url = prompt("Connect to JMX server (host:port)");
                        if (url != null) {
                            try {
                                jmxConnect(url);
                                print("connected!");
                            } catch (e) {
                                error(e, "Can not connect to " + url);
                            }
                        }
                    });
        }


var pad = '';

function arrayToString(o) {
    pad += '\t';
    if (o === undefined)
        return "[]";

    for (var s = 0; s < o.length; s++) {
        var type = typeof (o[s]);

        var v = o[s];

        try {
            type = o[s].getClass();

            if (type.isArray())
                v = o[s].length;

        } catch (e) {
        }

        print(pad + " " + s + " " + type + " " + v);

        if (o[s] == null)
            continue;

        if (type.isArray()) {
            arrayToString(o[s]);
        }
    }
    pad = pad.slice(0, pad.length - 1);
}

