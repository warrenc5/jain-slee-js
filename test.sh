JAVA_HOME=/usr/local/java/graalvm-ce-java11-20.0.0/ mvn -Pgraal install 
cp target/jslee-js bin

bin/jslee-js --js.username=wozza --js.password=wozza --js.url=service:jmx:remote+http://localhost:9990 src/test/js/service-activate-deactivate.js 
