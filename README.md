# jain-slee-js
Use Javascript to manage JAIN SLEE Servers with JMX


Activate Services
    var serviceID = new ServiceID('XmlRpc Service', 'MOFOKOM', '1.0');
    var sbbID = new SbbID('XmlRpc Sbb', 'MOFOKOM', '1.0');

    var services = java.lang.reflect.Array.newInstance(ServiceID, 100);
    services = serviceMBean.getServices(ServiceState.ACTIVE);
    print(toString(services));
    for (var s = 0; s < services.length; s++) {
        serviceMBean.deactivate(services);
    }


Create Resource Adaptor Entities

    var raLinkName = 'XmlRpc Resource Adaptor Entity Link';
    var raEntityName = 'xmlrpc-entity';

    var raID = new ResourceAdaptorID('XmlRpc Resource Adaptor', 'MOFOKOM', '1.0');

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
        spec = new ProfileSpecificationID('Mofokom URI Profile', 'mofokom', '1.0-SNAPSHOT')
        tableName = 'Default Mofokom Application Profile Table'
        profileName = 'Default Mofokom Application Profile'
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
