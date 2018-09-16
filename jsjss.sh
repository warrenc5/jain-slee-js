BASE=`dirname $0`
CLASSPATH=$BASE/src/main/js:$BASE/src/test/js:$BASE/target/classes/:$BASE/target/test-classes/:/home/wozza/.m2/repository/mofokom/mobi/jslee-js/1.0.0-SNAPSHOT/jslee-js-1.0.0-SNAPSHOT.jar 
#JAVA_OPTS="-Djava.security.policy=$HOME/.java.policy -Djava.security.manager -J-agentlib:jdwp=server=y,suspend=n,transport=dt_socket,address=8788"
java $JAVA_OPTS -classpath $CLASSPATH -Djs.url=service:jmx:remote+http://localhost:9990 -Djs.host=localhost:1090 -Djs.base=jmxconnector -Djs.username=wozza -Djs.password=wozza RunScript $@
