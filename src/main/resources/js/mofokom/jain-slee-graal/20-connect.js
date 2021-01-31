import * as jmx from '/resource:js/mofokom/jain-slee-graal/15-jmx-base.js'

const debug = js_debug || false
const trace = js_trace || false

export function connect() {
    var mmConnection = null
//mobicents
//debug = true
    try {
        var username = js_username
        var password = js_password
        var url = js_url


        if (debug)
            print("connecting to " + url + " as " + username)
        if (trace)
            print("password " + password)
//old jboss
        //jmxConnect("localhost:1090", "jmxconnector")
        //jmxConnect("localhost:1090", "jmxconnector",username,password)
//wildfly 10
        //jmxConnectURL("service:jmx:remote+http://localhost:9990",username,password)

        //   url = 'service:jmx:http-remoting-jmx://localhost:9990';
        //url = 'service:jmx:remote+http://localhost:9990';
        //  username = 'wozza'
        // password = 'wozza'
        var r = true;
        if (url == null) {
            print("no url --js.url=service:jmx:remote+http://localhost:9990");
            r = false;
        }
        if (username == null) {
            print("no username --js.username=wozza");
            r = false;
        }
        if (password == null) {
            print("no password --js.password=wozza");
            r = false;
        }

        if (r == false)
            return false;

        var connection = jmx.jmxConnectURL(url, username, password)
        //jmx.jmxConnectURL(url, username, password)
//opencloud
        //jmxConnect("localhost:1199","opencloud/rhino",username,passsword)
//test
//https://stackoverflow.com/questions/22212693/wildfly-8-final-jconsole-cant-connect-remotely
//RMI
        //jmxConnect("localhost:1090","jmxrmi")
        //jmxConnectURL("service:jmx:rmi://localhost:1090/jndi/jmx/invoker/RMIAdaptor")
        //jmxConnectURL("service:jmx:rmi://localhost:1090/jmxrmi")

        return connection != null;
    } catch (e) {
        if (typeof e == 'object') {
            console.log("connection exception", e)
        } else {
            print("connection exception", e)
        }
        throw e;
    }
    return false;
}