console.log("create sccp address script")
var ParameterFactoryImpl = Java.type("org.mobicents.protocols.ss7.sccp.impl.parameter.ParameterFactoryImpl");
var sccpParameterFactory = new org.mobicents.protocols.ss7.sccp.impl.parameter.ParameterFactoryImpl();
var es = sccpParameterFactory.createEncodingScheme(java.lang.Byte.valueOf(1));
var tt = 0;
var np = org.mobicents.protocols.ss7.indicator.NumberingPlan.ISDN_TELEPHONY;
var noa = org.mobicents.protocols.ss7.indicator.NatureOfAddress.INTERNATIONAL;
var ssn = 1;
var localGt = "12345678";
var dpc =0;

var gt = sccpParameterFactory.createGlobalTitle(localGt, tt, np, es, noa);
var sccpLocalGt = sccpParameterFactory.createSccpAddress(org.mobicents.protocols.ss7.indicator.RoutingIndicator.ROUTING_BASED_ON_GLOBAL_TITLE,
                sccpParameterFactory.createGlobalTitle(localGt, tt, np, es, noa),
                dpc, ssn);

console.log(sccpLocalGt.toString());
