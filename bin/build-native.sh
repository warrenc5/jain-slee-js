#!/bin/bash -i 

BASE=`dirname $0`
#sdk use java 22.2.r11-grl
sdk use java 22.3.1.r11-grl
mvn -Pnative -Dmaven.test.skip $* 
target/jslee-js < src/test/js/simple.js

