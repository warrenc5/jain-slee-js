var mmConnection = null;
//mobicents
try {
    //jmxConnect("localhost:1090");
    jmxConnect("localhost:1090", "jmxconnector");
    //
    //jmxConnect("10.199.7.13:1090","jmxconnector");
    //RMI
    //jmxConnect("localhost:1090","jmxrmi");
    //jmxConnectURL("service:jmx:rmi://localhost:1090/jndi/jmx/invoker/RMIAdaptor");
    //jmxConnectURL("service:jmx:rmi://localhost:1090/jmxrmi");

    //opencloud
    //jmxConnect("localhost:1199","opencloud/rhino","admin","password");

} catch (e) {
    print(e);
}

