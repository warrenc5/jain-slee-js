#!/bin/sh -x

mv src/main/resources/META-INF/native-image src/main/resources/META-INF/native-image.backup.`date -Iminutes`
rm -rf src/main/resources/META-INF/native-image

#JAVA_HOME=/usr/local/java/graalvm/ 
MAVEN_OPTS='--add-exports=java.base/jdk.internal.module=ALL-UNNAMED' 

export JAVA_HOME
export MAVEN_OPTS

mvn -Prun -Djs.debug=true -Djs.trace=true -Djs.username=admin -Djs.password=admin -Djs.host=172.69.0.6 -Djs.script=src/test/js/profiles2.js

if [ "$?" -ne "0" ] ; then
exit 1
fi

mv target/native src/main/resources/META-INF/native-image

./test.sh
