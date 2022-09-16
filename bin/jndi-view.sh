#CLASSPATH=/opt/wildfly/bin/client/jboss-cli-client.jar
CLASSPATH=src/main/js:target/classes
CLASSPATH=$CLASSPATH:`pwd`/target/dependency/*

for i in `find target/dependency` ; do
  CLASSPATH=$CLASSPATH:$i
done 
echo $CLASSPATH
echo make sure jboss-cli is on the classpath
export CLASSPATH
if [ -z `which jython` ] ; then 
        apt-get install jython
fi
jython jndi-view.py
