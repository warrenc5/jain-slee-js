console.log("create sccp address script")
var agent = Java.type("run.Agent")
agent.addClassPath('/media/work/inst/telscale-slee-7.2.0-5.13-wildfly-10.1.0.Final/wildfly-10.1.0.Final/modules/system/layers/base/org/mobicents/ss7/')

var AddressIndicator = Java.type('org.mobicents.protocols.ss7.indicator.AddressIndicator');
var GlobalTitleIndicator = Java.type('org.mobicents.protocols.ss7.indicator.GlobalTitleIndicator');
var NumberingPlan = Java.type('org.mobicents.protocols.ss7.indicator.NumberingPlan')
var NatureOfAddress = Java.type('org.mobicents.protocols.ss7.indicator.NatureOfAddress')
var RoutingIndicator = Java.type('org.mobicents.protocols.ss7.indicator.RoutingIndicator')
var ParameterFactoryImpl = Java.type("org.mobicents.protocols.ss7.sccp.impl.parameter.ParameterFactoryImpl")
var EncodingScheme = Java.type('org.mobicents.protocols.ss7.sccp.parameter.EncodingScheme')
var GlobalTitle = Java.type('org.mobicents.protocols.ss7.sccp.parameter.GlobalTitle')
var GlobalTitle0001 = Java.type('org.mobicents.protocols.ss7.sccp.parameter.GlobalTitle0001')
var SccpProtocolVersion = Java.type("org.mobicents.protocols.ss7.sccp.SccpProtocolVersion")

var sccpParameterFactory = new org.mobicents.protocols.ss7.sccp.impl.parameter.ParameterFactoryImpl()

var localGT = "12345678"
var es = localGT.length % 2 == 0 ? sccpParameterFactory.createEncodingScheme(2) : sccpParameterFactory.createEncodingScheme(1);
var tt = 0
var np = NumberingPlan.ISDN_TELEPHONY
var noa = NatureOfAddress.INTERNATIONAL
var ssn = 7
var dpc = 0

console.log('\n')
console.log('RoutingIndicator', RoutingIndicator.values(), '\n')
console.log('NumberingPlan', NumberingPlan.values(), '\n')
console.log('GlobalTitleIndicator', GlobalTitleIndicator.values(), '\n')
//console.log('NatureOfAddress', NatureOfAddress.values(), '\n')

//console.log('BigEnum2', Object.keys(Java.type('BigOne')), '\n')

var keys = [];
for (var key in org.mobicents.protocols.ss7.indicator.NatureOfAddress) {
    keys.push(key);
}

console.log('NatureOfAddress', keys.join(' '), '\n')


var ai = new AddressIndicator(true, true, RoutingIndicator.ROUTING_BASED_ON_GLOBAL_TITLE, GlobalTitleIndicator.GLOBAL_TITLE_INCLUDES_TRANSLATION_TYPE_NUMBERING_PLAN_ENCODING_SCHEME_AND_NATURE_OF_ADDRESS);

var gt = sccpParameterFactory.createGlobalTitle(localGT, tt, np, es, noa)

var sccpLocal = sccpParameterFactory.createSccpAddress(RoutingIndicator.ROUTING_BASED_ON_GLOBAL_TITLE,
        sccpParameterFactory.createGlobalTitle(localGT, tt, np, es, noa),
        dpc, ssn)
console.log(sccpLocal.toString(), '\n')

var ai = sccpLocal.getAddressIndicator()
var aiValue = ai.getValue(SccpProtocolVersion.ITU);

console.log("AddressIndicator", aiValue, ai.toString())

ai = new AddressIndicator(true, true, RoutingIndicator.ROUTING_BASED_ON_DPC_AND_SSN, GlobalTitleIndicator.GLOBAL_TITLE_INCLUDES_TRANSLATION_TYPE_NUMBERING_PLAN_ENCODING_SCHEME_AND_NATURE_OF_ADDRESS);
aiValue = ai.getValue(SccpProtocolVersion.ITU);

console.log("Translated AddressIndicator", aiValue, ai.toString())
dpc = 2839
sccpLocal = sccpParameterFactory.createSccpAddress(RoutingIndicator.ROUTING_BASED_ON_DPC_AND_SSN,
        sccpParameterFactory.createGlobalTitle(localGT, tt, np, es, noa),
        dpc, ssn)
console.log("Translated Address", sccpLocal.toString(), '\n')

//Received SccpMessage=Sccp Msg [Type=UDT networkId=0 sls=15 incomingOpc=2820 incomingDpc=2833 outgoingDpc=-1 CallingAddress(pc=0,ssn=6,AI=18,gt=GlobalTitle0100Impl [digits=2438400553, natureOfAddress=INTERNATIONAL, numberingPlan=ISDN_TELEPHONY, translationType=0, encodingScheme=BCDEvenEncodingScheme[type=BCD_EVEN, code=2]]) CalledParty(pc=0,ssn=7,AI=18,gt=GlobalTitle0100Impl [digits=243899099640, natureOfAddress=INTERNATIONAL, numberingPlan=ISDN_TELEPHONY, translationType=0, encodingScheme=BCDEvenEncodingScheme[type=BCD_EVEN, code=2]]) DataLen=164] for Translation but no PC is present for primary Address 


ai = new AddressIndicator(16,SccpProtocolVersion.ITU)
aiValue = ai.getValue(SccpProtocolVersion.ITU)
console.log("New AddressIndicator", aiValue, ai.toString())

ai = new AddressIndicator(17,SccpProtocolVersion.ITU)
aiValue = ai.getValue(SccpProtocolVersion.ITU)
console.log("New AddressIndicator", aiValue, ai.toString())

ai = new AddressIndicator(18,SccpProtocolVersion.ITU)
aiValue = ai.getValue(SccpProtocolVersion.ITU)
console.log("New AddressIndicator", aiValue, ai.toString())

ai = new AddressIndicator(true, true, RoutingIndicator.ROUTING_BASED_ON_GLOBAL_TITLE, GlobalTitleIndicator.GLOBAL_TITLE_INCLUDES_TRANSLATION_TYPE_NUMBERING_PLAN_ENCODING_SCHEME_AND_NATURE_OF_ADDRESS);
aiValue = ai.getValue(SccpProtocolVersion.ITU)
console.log("New AddressIndicator", aiValue, ai.toString())

var value = parseInt("12", 16);
console.log(value)
