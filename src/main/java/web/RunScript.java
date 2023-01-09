package web;

import java.io.IOException;
import java.lang.management.ManagementFactory;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import javax.annotation.ManagedBean;
import javax.management.MBeanServer;
import javax.script.ScriptException;
import org.apache.log4j.Level;
import org.apache.log4j.Logger;

/**
 *
 * @author wozza
 */
//@Startup
//@ManagedBean
public class RunScript implements RunScriptMBean {

    private MBeanServer mbeanServer;

    private final Logger log = Logger.getLogger(RunScript.class.getName());
    private String status;

    public RunScript() {
        mbeanServer = ManagementFactory.getPlatformMBeanServer();
    }

    public boolean run(String... args) throws Exception {
        try {

        System.err.println(Arrays.asList(args).toString());
            run.RunScript.main(
                    merge(new String[]{
                "--url",
                System.getProperty("js.url", "service:jmx:local:///"),
                //"--url", "service:jmx:remote+http://localhost:9990",
                "--noexit",
                "--debug",
                //"--trace",
                "--username",
                System.getProperty("js.username", "admin"),
                "--password",
                System.getProperty("js.password", "admin")
                    },
                            args,
                            System.getProperty("js.scripts", "").split(",")
                    )
                    //"/wildfly-10.1.0.Final/standalone/data/data.js", "/js/profiles2.js"});
            );
            return true;
        } catch (RuntimeException ex) {
            log.log(Level.ERROR, ex.getMessage());
        } catch (ScriptException ex) {
            log.log(Level.ERROR, ex.getMessage());
        } catch (IOException ex) {
            log.log(Level.ERROR, ex.getMessage());
        } catch (URISyntaxException ex) {
            log.log(Level.ERROR, ex.getMessage());
        }
        return false;
    }

    private String[] merge(String[]... a) {
        List<String> t = new ArrayList<>();
        for (String[] t1 : a) {
            t.addAll(Arrays.asList(t1));
        }
        return t.toArray(new String[t.size()]);
    }

}
