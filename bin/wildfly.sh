#!/bin/bash -x


`dirname $0`/jmxjs.sh --url=service:jmx:remote+http://$IP:9990 --username=admin --password=admin $@
