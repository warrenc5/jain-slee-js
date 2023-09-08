# jain-slee-js

Provides a scriptable api to access Operational Maintainence interface of JAIN SLEE based services over Java Management Extensions. 

Automate or schedule common usage scenarios - examples included in src/test/resources.

* Access Sbb/Profile/Resource Adaptor Usage Parameters (timeseries aggregate for collection to Grafana)
* Perform deployable unit services installations
* Create RA entities post deployment.
* Activate/Deactivate services 
* Create and manage Profiles Tables and Profiles
* List activities & SbbEntities

Launch scripts from the command line

usage jmxjs --debug --trace --username=wozza --password=wozza [--url=service:jmx:remote+http://localhost:9990] [--host=localhost] [--port=9990] somefile.js < myfile.js

note standard in is processed before any files specified on the command line.

Use Javascript to manage JAIN SLEE Servers with JMX


Activate Services

```
    var serviceID = new ServiceID('XmlRpc Service', 'Juno', '1.0');
    var sbbID = new SbbID('XmlRpc Sbb', 'Juno', '1.0');

    var services = java.lang.reflect.Array.newInstance(ServiceID, 100);
    services = serviceMBean.getServices(ServiceState.ACTIVE);
    print(toString(services));
    for (var s = 0; s < services.length; s++) {
        serviceMBean.deactivate(services);
    }
```


Create Resource Adaptor Entities

```
    var raLinkName = 'XmlRpc Resource Adaptor Entity Link';
    var raEntityName = 'xmlrpc-entity';

    var raID = new ResourceAdaptorID('XmlRpc Resource Adaptor', 'Juno', '1.0');

    var properties = new javax.slee.resource.ConfigProperties();

    properties.addProperty(new javax.slee.resource.ConfigProperties.Property('DEST_URL', 'java.lang.String', '/xmlrpc-www-1.0-SNAPSHOT/XMLRPCValidatingServlet'));
    resourceAdaptorMBean.createResourceAdaptorEntity(raID, raEntityName, properties);

    //bind link
    resourceAdaptorMBean.bindLinkName(raEntityName, raLinkName);

    //activate ra entity
    resourceAdaptorMBean.activateResourceAdaptorEntity(raEntityName);
```

Create Profiles

```
    var spec = Packages.javax.slee.profile.ProfileSpecificationID;

    {
        spec = new ProfileSpecificationID('Juno URI Profile', 'Juno', '1.0-SNAPSHOT')
        tableName = 'Default Juno Application Profile Table'
        profileName = 'Default Juno Application Profile'
        var profile = createProfileTable(spec, tableName, profileName);

        {
            profile.editProfile();

            profile.Address = new Address(AddressPlan.UNDEFINED, '123');

            profile.Url = '';
            profile.Username = '';
            profile.Password = '';
            profile.ServiceKey = '';

            profile.commitProfile();
        }
    }
```

Pass scripts on the standard in.

```
~/code/jslee-js/bin/jmxjs.sh --host 172.24.0.2 << EOF
import * as js from '/resource:js/jain-slee.js'

js.listProfiles();
js.profileProvMBean.help()
var profileObjectName = js.profileProvMBean.getProfile("MyTable", "profile1")
var profileMBean = js.mbean(profileObjectName)
profileMBean.help()
console.log(JSON.stringify(profileMBean));
EOF
```


    https://stackoverflow.com/questions/1751130/calling-jmx-mbean-method-from-a-shell-script?rq=1
