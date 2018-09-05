CLASSPATH=/opt/wildfly/bin/client/jboss-cli-client.jar
CLASSPATH=$CLASSPATH:src/main/js:target/classes
CLASSPATH=$CLASSPATH:`pwd`/target/dependency/*
for i in `find target/dependency` ; do
  CLASSPATH=$CLASSPATH:$i
done 
echo $CLASSPATH
export CLASSPATH

~/jython2.7.0/bin/jython jndi-view.py
