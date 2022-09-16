#http://mastertheboss.com/jboss-server/jboss-script/manage-jboss-as-7-with-jython
from java.util import Date
from org.jboss.as.cli.scriptsupport import CLI

cli = CLI.newInstance()
cli.connect()
cli.cmd("cd /subsystem=naming")
result = cli.cmd(":jndi-view")
response = result.getResponse()
print
print '===================JNDI VIEW======================= '
print response
cli.disconnect()
