#!/bin/bash -i
BASE=$(readlink -f `dirname $0`)

IP=${IP:=172.25.0.2}
JMX_URL=service:jmx:remote+http://${IP}:9990 

sdk use java 22.2.r11-grl
#MAVEN_OPTS='--add-exports=java.base/jdk.internal.module=ALL-UNNAMED' 
#export JAVA_HOME MAVEN_OPTS

cp -r src/main/resources/META-INF/native-image src/main/resources/META-INF/native-image.`date +%y%m%d%h%M`

mvn package -Dmaven.test.skip 

JAVA_OPTS="-agentlib:native-image-agent=config-output-dir=$BASE/../target/native-image/"
CLASSPATH=/media/work/inst/telscale-slee-7.2.0-5.13-wildfly-10.1.0.Final/wildfly-10.1.0.Final/modules/system/layers/base/org/mobicents/ss7/modules/main/*:/media/work/inst/telscale-slee-7.2.0-5.13-wildfly-10.1.0.Final/wildfly-10.1.0.Final/modules/system/layers/base/org/mobicents/ss7/commons/main/*

export JAVA_OPTS CLASSPATH

#mvn -U -Dexecutable=`which java` -Dmaven.test.skip -Prun -Djs.debug=true -Djs.trace=true -Djs.username=admin -Djs.password=admin -Djs.host=172.25.0.2 -Djs.script=src/test/js/usage.js

$BASE/jmxjs.sh $@ --url $JMX_URL

cp -rT target/native-image src/main/resources/META-INF/native-image

