# jain-slee-js

Provides a scriptable api to access Operational Maintainence interface of JAIN SLEE based services over Java Management Extensions. 

Automate or schedule common usage scenarios.

* Access Sbb/Profile/Resource Adaptor Usage Parameters for example timeseries aggregate for collectd to grafana
* Perform deployable unit services installations
* Create RA entities post deployment.
* Activate/Deactivate services 
* Create and manage Profiles Tables and Profiles

Use Javascript to manage JAIN SLEE Servers with JMX


Activate Services
    var serviceID = new ServiceID('XmlRpc Service', 'Juno', '1.0');
    var sbbID = new SbbID('XmlRpc Sbb', 'Juno', '1.0');

    var services = java.lang.reflect.Array.newInstance(ServiceID, 100);
    services = serviceMBean.getServices(ServiceState.ACTIVE);
    print(toString(services));
    for (var s = 0; s < services.length; s++) {
        serviceMBean.deactivate(services);
    }


Create Resource Adaptor Entities

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

Create Profiles

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

    https://stackoverflow.com/questions/1751130/calling-jmx-mbean-method-from-a-shell-script?rq=1
