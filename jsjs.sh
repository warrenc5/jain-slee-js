CLASSPATH=$CLASSPATH:src/main/js:target/classes
CLASSPATH=$CLASSPATH:`pwd`/target/dependency/*
for i in `find target/dependency` ; do
  CLASSPATH=$CLASSPATH:$i
done 
echo $CLASSPATH
jjs $JAVA_OPTS -classpath $CLASSPATH -Djs.url= -Djs.host=localhost:1090 -Djs.base=jmxconnector -Djs.username=wozza -Djs.password=wozza $@
