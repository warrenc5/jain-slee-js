
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.net.URISyntaxException;
import java.net.URL;
import javax.script.ScriptEngineManager;
import javax.script.ScriptEngine;
import javax.script.ScriptException;
import javax.slee.management.ServiceState;

public class RunScript {

    public static void main(String[] args) throws ScriptException, IOException, URISyntaxException {
        ScriptEngineManager scriptEngineManager = new ScriptEngineManager();
        ScriptEngine nashorn = scriptEngineManager.getEngineByName("nashorn");

        ServiceState ACTIVE = javax.slee.management.ServiceState.ACTIVE;

        System.setProperty("js.url", System.getProperty("js.url", "service:jmx:remote+http://localhost:9990"));
        System.setProperty("js.username", System.getProperty("js.username", "wozza"));
        System.setProperty("js.password", System.getProperty("js.password", "wozza"));

        File f = null;
        if (args[0].startsWith("classpath:")) {
            String u = args[0].substring("classpath:".length());
            System.err.println("looking in classpath for " + u);
            URL url = RunScript.class.getResource(u);
            f = new File(url.toURI());
        } else {
            f = new File(args[0]);
        }

        Object result = nashorn.eval(new FileReader(f.getAbsolutePath()));
    }
}
