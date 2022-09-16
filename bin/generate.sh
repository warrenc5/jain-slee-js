#!/bin/bash -i

sdk use java 22.2.r11-grl
#MAVEN_OPTS='--add-exports=java.base/jdk.internal.module=ALL-UNNAMED' 
#export JAVA_HOME MAVEN_OPTS

cp -r src/main/resources/META-INF/native-image src/main/resources/META-INF/native-image.`date +%y%m%d%h%M`

mvn -U -Dexecutable=`which java` -Dmaven.test.skip -Prun -Djs.debug=true -Djs.trace=true -Djs.username=admin -Djs.password=admin -Djs.host=172.25.0.2 -Djs.script=src/test/js/usage.js

cp -rT target/native-image src/main/resources/META-INF/native-image

