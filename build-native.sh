#!/bin/bash -i 

BASE=`dirname $0`
sdk use java 22.2.r11-grl
mvn -Pnative -Dmaven.test.skip $*
