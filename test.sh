#!/bin/sh -x 

JAVA_HOME=/usr/local/java/graalvm mvn -Pgraal clean install 
#--add-exports=java.base/jdk.internal.module=ALL-UNNAMED
#target/jslee-js --js.debug=true --js.trace=true --js.username=admin --js.password=admin --js.url=service:jmx:remote+http://172.69.0.6:9990 src/test/js/simple.js

if [ -f "target/jslee-js" ] ; then
  cp target/jslee-js bin
fi
