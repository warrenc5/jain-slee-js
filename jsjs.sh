CLASSPATH=src/main/js:target/classes
CLASSPATH=$CLASSPATH:`pwd`/target/dependency/*
for i in `find target/dependency` ; do
  CLASSPATH=$CLASSPATH:$i
done 
echo $CLASSPATH
JAVA_OPTS="-Djava.security.policy=$HOME/.java.policy -Djava.security.manager -J-agentlib:jdwp=server=y,suspend=n,transport=dt_socket,address=8788"
jjs $JAVA_OPTS -classpath $CLASSPATH -Djs.url=service:jmx:remote+http://localhost:9990 -Djs.host=localhost:1090 -Djs.base=jmxconnector -Djs.username=wozza -Djs.password=wozza $@
