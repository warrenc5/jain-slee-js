JAVA_HOME=/usr/local/java/graalvm-ce-java11/ mvn -Pgraal clean install 
#--add-exports=java.base/jdk.internal.module=ALL-UNNAMED
USERNAME=admin
PASSWORD=admin
target/jslee-js --js.debug=true --js.trace=true --js.username=$USERNAME --js.password=$PASSWORD --js.url=service:jmx:remote+http://localhost:9990 src/test/js/service-activate-deactivate.js 
cp target/jslee-js bin
