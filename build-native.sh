#!/bin/bash -x
BASE=`dirname $0`
JAVA_HOME=/usr/local/java/graalvm-ce-java11/
PATH=$JAVA_HOME/bin:$PATH
mvn -Pgraal -Dmaven.test.skip
