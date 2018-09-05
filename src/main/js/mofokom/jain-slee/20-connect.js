var mmConnection = null;
//mobicents
var debug = java.lang.System.getProperty("js.debug");
try {
    var username = java.lang.System.getProperty("js.username");
    var password = java.lang.System.getProperty("js.password");
    var url = java.lang.System.getProperty("js.url");
//old jboss
    //jmxConnect("localhost:1090", "jmxconnector");
    //jmxConnect("localhost:1090", "jmxconnector",username,password);
//wildfly 10
    //jmxConnectURL("service:jmx:remote+http://localhost:9990",username,password);
    jmxConnectURL(url, username, password);
//opencloud
    //jmxConnect("localhost:1199","opencloud/rhino",username,passsword);
//test
//https://stackoverflow.com/questions/22212693/wildfly-8-final-jconsole-cant-connect-remotely
//RMI
    //jmxConnect("localhost:1090","jmxrmi");
    //jmxConnectURL("service:jmx:rmi://localhost:1090/jndi/jmx/invoker/RMIAdaptor");
    //jmxConnectURL("service:jmx:rmi://localhost:1090/jmxrmi");
} catch (e) {
    print("connection exception", e);
}

