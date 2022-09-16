#!/bin/sh -x 

#JAVA_HOME=/usr/local/java/graalvm-ce-java11-21.0.0/
#MAVEN_OPTS='--add-exports=java.base/jdk.internal.module=ALL-UNNAMED' 

#export JAVA_HOME MAVEN_OPTS
#mvn -U -Dmaven.test.skip -Pgraal -Prun-native -Djs.debug=true -Djs.trace=true -Djs.username=admin -Djs.password=admin -Djs.host=172.69.0.6 -Djs.script=src/test/js/usage.js

#mvn -U -Dmaven.test.skip -Pnative 
#mvn -U -Dmaven.test.skip -Prun-native -Djs.debug=true -Djs.trace=true -Djs.username=admin -Djs.password=admin -Djs.host=172.69.0.6 -Djs.script=src/test/js/usage.js
mvn -Dmaven.test.skip -Pnative -Prun-native -Djs.debug=true -Djs.trace=true -Djs.username=admin -Djs.password=admin -Djs.script=src/test/js/usage.js
#mvn -Dmaven.test.skip -Prun-native -Djs.debug=true -Djs.trace=true -Djs.username=admin -Djs.password=admin -Djs.script=src/test/js/usage.js

if [ -f "target/jslee-js" ] ; then
  cp target/jslee-js bin
fi
