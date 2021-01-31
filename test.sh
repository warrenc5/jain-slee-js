#!/bin/sh -x 

JAVA_HOME=/usr/local/java/graalvm mvn -Dmaven.test.skip -Pgraal -Prun-native -Djs.debug=true -Djs.trace=true -Djs.username=admin -Djs.password=admin -Djs.host=172.69.0.6 -Djs.script=src/test/js/profiles2.js 

if [ -f "target/jslee-js" ] ; then
  cp target/jslee-js bin
fi
