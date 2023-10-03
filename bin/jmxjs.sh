#!/bin/bash -x
JAVA_OPTS="--illegal-access=warn"
SCRIPT_DIR=$(readlink -f `dirname $0`)

BASE=$(readlink -f `dirname $0`/..)

if [ -f src/main/resources/logging.properties ] ; then 
LOGGING='-Djava.util.logging.config.file=src/main/resources/logging.properties'
fi

if [ -d target ] ; then 


CLASSPATH=
CLASSPATH+=:$BASE/src/main/js:$BASE/src/test/js:$BASE/target/classes/:$BASE/target/test-classes/:$BASE/src/main/resources
CLASSPATH+=":$BASE/target/jslee-js-1.0.Final.jar:$BASE/target/dependency/runtime/*:$BASE/target/dependency/compile/*:$BASE/target/dependency/provided/*"


else 

CLASSPATH=$CLASSPATH:/media/work/.m2/repository/mobi/mofokom/jslee-js/1.0.2-SNAPSHOT/jslee-js-1.0.2-SNAPSHOT-shade.jar
CLASSPATH=$BASE/jslee-js-1.0.2-SNAPSHOT-shade.jar:$CLASSPATH

fi 

if [ -z "$JBOSS_HOME" ] ; then 
JBOSS_HOME=/media/work/inst/telscale-slee-7.2.0-5.13-wildfly-10.1.0.Final/wildfly-10.1.0.Final
fi 

CLASSPATH+=:${JBOSS_HOME}/modules/system/layers/base/org/mobicents/ss7/modules/main/*:${JBOSS_HOME}/modules/system/layers/base/org/mobicents/ss7/commons/main/*:${JBOSS_HOME}/modules/system/layers/base/org/restcomm/diameter/lib/main/:${JBOSS_HOME}/modules/system/layers/base/org/restcomm/smpp/bootstrap/main/*

echo ========= $CLASSPATH ==============

#JAVA_OPTS="-agentlib:jdwp=transport=dt_socket,server=y,suspend=y,address=8000"
JAVA_OPTS="$JAVA_OPTS --add-opens=jdk.internal.vm.ci/jdk.vm.ci.services=ALL-UNNAMED \
--add-opens=jdk.internal.vm.ci/jdk.vm.ci.hotspot=ALL-UNNAMED 
--add-opens=jdk.internal.vm.ci/jdk.vm.ci.runtime=ALL-UNNAMED 
--add-opens=jdk.internal.vm.ci/jdk.vm.ci.code=ALL-UNNAMED 
--add-opens=jdk.internal.vm.ci/jdk.vm.ci.code.stack=ALL-UNNAMED 
--add-opens=jdk.internal.vm.ci/jdk.vm.ci.meta=ALL-UNNAMED 
--add-opens=jdk.internal.vm.ci/jdk.vm.ci.common=ALL-UNNAMED 
--add-opens=jdk.internal.vm.compiler/org.graalvm.compiler.core.target=ALL-UNNAMED 
--add-opens=jdk.internal.vm.compiler/org.graalvm.compiler.core.common=ALL-UNNAMED 
--add-opens=jdk.internal.vm.compiler/org.graalvm.compiler.hotspot=ALL-UNNAMED 
-Dgraal.CompilationFailureAction=Silent -XX:+UnlockExperimentalVMOptions -XX:+UseJVMCICompiler -Djava.security.manager -Djava.security.policy=$SCRIPT_DIR/java.policy"
let native=0 

JAVA=java
if [ -n "$JAVA_HOME" ] ; then
  JAVA=${JAVA_HOME}/bin/java
fi
$JAVA $LOGGING $JAVA_OPTS -classpath $CLASSPATH run.RunScript $@

exit

ARGV=""
ARG=""
NATIVEBASE=""
IFS='\= ' read -r -a - <<< "$@"
echo $@
while [[ $# > 0 ]] ; do
  case "$1" in
    --host)
      js_host=${2}
      shift
    ;;
    --port)
      js_port=${2}
      shift
      ;;
    --url)
      js_url=${2}
      shift
      ;;
    --username)
      js_username=${2}
      shift
      ;;
    --password)
      js_password=${2}
      shift
      ;;
    --debug)
      ARGV="$ARGV ${1}"
      ;;
    --trace)
      ARGV="$ARGV ${1}"
      ;;
    --nativebase)
    echo "nativebase"
      NATIVEBASE="${2}"
      shift
      ;;
    --native)
      let native=1
      ;;
    *)
      ARG="$ARG ${1}"
  esac
  shift
done

if [ -z "$js_host" ] ; then 
js_host=localhost
fi 

if [ -z "$js_port" ] ; then 
js_port=9990
fi 

if [ -z "$js_url" ] ; then 
js_url="service:jmx:remote+http://${js_host}:${js_port}"
fi 

if [ -z "$js_username" ] ; then 
js_username=admin
fi 

if [ "$js_password" == "-" ] ; then 
echo -n "password: "; stty -echo; read js_password; stty echo; echo
fi 

if [ -z "$js_password" ] ; then 
js_password="admin"
fi 

if [ -z "$NATIVEBASE" ] ; then 
NATIVEBASE="."
fi 

ARGV="$ARGV --username=${js_username} --password=${js_password} --url=${js_url}"

if [ $native -eq 0 ] ; then
java $JAVA_OPTS -classpath $CLASSPATH run.RunScript $ARGV $ARG
fi
if [ $native -eq 1 ] ; then
echo "native"
echo $NATIVEBASE $native 
${NATIVEBASE}/jslee-js $ARGV $ARG
fi
