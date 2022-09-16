#!/bin/bash -x

BASE=`dirname $0`
sdk use java 22.2.r11-grl

mvn -Dgraal.version=${GRAAL_VERSION} -Dmaven.test.skip install
