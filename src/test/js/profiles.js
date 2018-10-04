load('classpath:jain-slee.js');

var profileSpecs = deploymentMBean.ProfileSpecifications;
profileMBean.help();

for each (var profile in profileSpecs) {
    print(profile);
}

{
    spec = new javax.slee.profile.ProfileSpecificationID('Mofokom URI Profile', 'mofokom', '1.0-SNAPSHOT')
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

{
    spec = new ProfileSpecificationID('Mofokom Profile', 'mofokom', '1.0-SNAPSHOT');
    tableName = 'Default Mofokom Application Profile Table';
    profileName = 'Default Mofokom Application Profile';
    var profile = createProfileTable(spec, tableName, profileName);
    {
        profile.editProfile();
        profile.Address = new Address(AddressPlan.UNDEFINED, '123');
        profile.MasterKey = '29800bab79b5b51fdc196efee58ac273';
        //profile.StationId = '';
        //profile.DealerCode = '';
        profile.DeviceSN = '2QRS0001';
        profile.Username = 'test.mofokom';
        profile.Password = 'password';
        profile.EndpointAddress = 'http://41.223.145.186:9004/imposservice';

        profile.commitProfile();
    }
}
{
    spec = new ProfileSpecificationID('AddressProfileSpec', 'javax.slee', '1.1');

    {
        tableName = 'TestUSSDServiceAddressTable';
        profileName = 'Default Test Profile'
        var profile = createProfileTable(spec, tableName, profileName);
        {
            profile.editProfile();
            profile.Address = new Address(AddressPlan.UNDEFINED, '*771#');

            profile.commitProfile();
        }
    }
    {
        tableName = 'Mofokom Email Trigger Service Address Profile Table'
        profileName = 'Default Mofokom Application Profile'
        var profile = createProfileTable(spec, tableName, profileName);
        {
            profile.editProfile();
            profile.Address = new Address(AddressPlan.SMTP, 'mofokom@mofokom.com');

            profile.commitProfile();
        }
        {
            tableName = 'Mofokom SIP Trigger Service Address Profile Table'
            profileName = 'Default Mofokom Application Profile'
            var profile = createProfileTable(spec, tableName, profileName);
            {
                profile.editProfile();
                profile.Address = new Address(AddressPlan.SIP, 'sip:123@mofokom.com');
                profile.commitProfile();
            }
        }
        {
            tableName = 'Mofokom SMS Trigger Service Address Profile Table'
            profileName = 'Default Mofokom Application Profile'
            {
                var profile = createProfileTable(spec, tableName, profileName);
                profile.editProfile();
                profile.Address = new Address(AddressPlan.E164, '1234');
                profile.commitProfile();
            }
        }
        {
            tableName = 'Mofokom USSD Trigger Service Address Profile Table'
            profileName = 'Default Mofokom Application Profile'
            var profile = createProfileTable(spec, tableName, profileName);
            {
                profile.editProfile();
                profile.Address = new Address(AddressPlan.E164, '123');
                profile.commitProfile();
            }
        }
        {
            tableName = 'Mofokom Servlet Service Address Profile Table'
        }
        {
            tableName = 'Mofokom Ussd Service Address Profile Table'
            profileName = 'Mofokom Application Profile'
            var profile = createProfileTable(spec, tableName, profileName);
            {
                profile.editProfile();
                profile.Address = new Address(AddressPlan.UNDEFINED, '*123#');
                profile.commitProfile();
            }
        }
    }
}