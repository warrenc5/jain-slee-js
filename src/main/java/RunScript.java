
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.net.URISyntaxException;
import java.net.URL;
import java.util.Arrays;
import java.util.Iterator;
import javax.script.ScriptEngine;
import javax.script.ScriptEngineFactory;
import javax.script.ScriptEngineManager;
import javax.script.ScriptException;

public class RunScript {

    public static void main(String[] args) throws ScriptException, IOException, URISyntaxException {
        ScriptEngineManager scriptEngineManager = new ScriptEngineManager();

        for (ScriptEngineFactory f : scriptEngineManager.getEngineFactories()) {
            System.out.println(f.getEngineName());
        }
        ScriptEngine engine = scriptEngineManager.getEngineByName("Graal.js");
        if (engine == null) {
            engine = scriptEngineManager.getEngineByName("nashorn");
        }


        /**
         * ServiceState ACTIVE = javax.slee.management.ServiceState.ACTIVE;

        System.setProperty("js.url", System.getProperty("js.url", "service:jmx:remote+http://localhost:9990"));
        System.setProperty("js.username", System.getProperty("js.username", "wozza"));
        System.setProperty("js.password",
         * System.getProperty("js.password", "wozza"));
        *
         */

        Iterator<String> i = Arrays.asList(args).iterator();
        File f = null;
        while (i.hasNext()) {
            //TODO: add help
            String arg = i.next();

            System.out.println(arg);
            if (arg.startsWith("--")) {
                System.setProperty(i.next(), i.next());
            } else if (arg.startsWith("classpath:")) {
                String u = arg.substring("classpath:".length());
            System.err.println("looking in classpath for " + u);
            URL url = RunScript.class.getResource(u);
                f = new File(url.toURI());
            } else {
                f = new File(arg);
            }
        }

        //TODO use graal
        Object result = engine.eval(new FileReader(f.getAbsolutePath()));
    }
}
