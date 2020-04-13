
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.net.URISyntaxException;
import java.net.URL;
import java.util.Arrays;
import java.util.Iterator;
import static java.util.stream.Collectors.toList;
import javax.script.ScriptEngine;
import javax.script.ScriptEngineFactory;
import javax.script.ScriptEngineManager;
import javax.script.ScriptException;
import org.graalvm.polyglot.Context;
import org.graalvm.polyglot.HostAccess;
import org.graalvm.polyglot.Source;
import org.graalvm.polyglot.Value;
import org.graalvm.polyglot.io.FileSystem;

public class RunScript {

    public static void main(String[] args) throws ScriptException, IOException, URISyntaxException {
        ScriptEngineManager scriptEngineManager = new ScriptEngineManager();

        System.err.println("available " + scriptEngineManager.getEngineFactories().stream().map(f -> f.getLanguageName() + " " + f.getEngineName() + " " + f.getEngineVersion()).collect(toList()).toString());

        ScriptEngine engine = scriptEngineManager.getEngineByName("Graal.js");

        if (engine == null) {
            System.err.println("fallback to default");
            engine = scriptEngineManager.getEngineByName("js");
        }

        if (engine == null) {
            System.err.println("fallback to nashorn");
            engine = scriptEngineManager.getEngineByName("nashorn");
        }

        if (engine != null && engine.getFactory() != null) {
            ScriptEngineFactory factory = engine.getFactory();
            System.err.println("using " + factory.getEngineName() + " " + factory.getLanguageName());
            System.err.println(factory.getExtensions().toString());
        }

        /**
         * ServiceState ACTIVE = javax.slee.management.ServiceState.ACTIVE;
         *
         * System.setProperty("js.url", System.getProperty("js.url",
         * "service:jmx:remote+http://localhost:9990"));
         * System.setProperty("js.username", System.getProperty("js.username",
         * "wozza")); System.setProperty("js.password",
         * System.getProperty("js.password", "wozza"));
         *
         */
        System.err.println(Arrays.asList(args).toString());
        Iterator<String> i = Arrays.asList(args).iterator();
        File f = null;
        while (i.hasNext()) {
            //TODO: add help
            String arg = i.next().trim();

            if (arg.startsWith("--")) {
                String[] c = arg.substring(2).split("=");
                String name = c[0].trim();
                String value = c[1].trim();
                System.setProperty(name, value);
                System.err.println(name + " " + value);
            } else if (arg.startsWith("-")) {
                if ("-v".equals(arg)) {
                    System.err.println("version 1.0");
                }
            } else if (arg.startsWith("classpath:")) {
                String u = arg.substring("classpath:".length());
                System.err.println("looking in classpath for " + u);
                URL url = RunScript.class.getResource(u);
                f = new File(url.toURI());
            } else {
                f = new File(arg);
            }
        }

        if (f == null) {
            System.err.println("usage jslee-js --js.debug=true --js.username=wozza --js.password=wozza --js.url=service:jmx:remote+http://localhost:9990 myfile.js");

        } else {

            FileSystem delegate = new MyFileSystem();
            System.err.println("using file " + f.getAbsolutePath());
            //TODO use graal
            try (Context context = Context.newBuilder()
                    .allowNativeAccess(true)
                    .allowAllAccess(true)
                    .allowHostClassLoading(true)
                    .allowHostClassLookup(s -> true)
                    .allowHostAccess(HostAccess.ALL)
                    .allowIO(true)
                    .allowExperimentalOptions(true)
                    //.option("js.nashorn-compat", "true")
                    .fileSystem(delegate)
                    .build()) {
                Value bindings = context.getBindings("js");
                bindings.putMember("js_username", System.getProperty("js.username"));
                bindings.putMember("js_password", System.getProperty("js.password"));
                bindings.putMember("js_url", System.getProperty("js.url"));
                bindings.putMember("js_debug", Boolean.getBoolean("js.debug"));

                Source source = Source.newBuilder("js", new FileReader(f.getAbsolutePath()), "main").mimeType("application/javascript+module").build();
                System.err.println("loaded source" + source.toString());
                context.eval(source);
                /**
                 * } catch (PolyglotException x) { System.err.println("failed :"
                 * + x.getMessage() + " source: " + x.getSourceLocation()); * }
                 * catch (Exception x) { System.err.println("failed :" +
                 * x.getMessage() + x.getClass().getName());
                 * x.printStackTrace();
                 *
                 */

            } catch (Exception x) {
                x.printStackTrace();
            } finally {
            }
        }

    }

    @HostAccess.Export
    public static String getProperty(String name) {
        return System.getProperty(name);
    }
}
