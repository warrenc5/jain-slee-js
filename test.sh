JAVA_HOME=/usr/local/java/graalvm-ce-java11/ mvn -Pgraal clean install 
cp target/jslee-js bin
#--add-exports=java.base/jdk.internal.module=ALL-UNNAMED
bin/jslee-js --js.username=wozza --js.password=wozza --js.url=service:jmx:remote+http://localhost:9990 src/test/js/service-activate-deactivate.js 
