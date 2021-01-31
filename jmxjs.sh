#!/bin/bash 
BASE=`dirname $0`

CLASSPATH=$BASE/target/jslee-js-1.0.0-SNAPSHOT.jar:$BASE/target/dependency/runtime/*:$BASE/target/dependency/compile/*

CLASSPATH=$BASE/src/main/js:$BASE/src/test/js:$BASE/target/classes/:$BASE/target/test-classes/:$CLASSPATH

ARGV=""
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
    *)
      ARG="$ARG ${1}"
      shift

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

ARGV="$ARGV --username=${js_username} --password=${js_password} --url=${js_url}"


java $JAVA_OPTS -classpath $CLASSPATH RunScript $ARGV $ARG
