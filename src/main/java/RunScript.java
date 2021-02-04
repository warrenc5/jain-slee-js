
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.ObjectStreamClass;
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
import org.graalvm.polyglot.PolyglotException;
import org.graalvm.polyglot.Source;
import org.graalvm.polyglot.Value;
import org.graalvm.polyglot.io.FileSystem;

public class RunScript {

    static {
        System.setProperty("jboss.threads.eqe.disable", Boolean.toString(true));
        javax.management.MBeanNotificationInfo.class.getClass();
        javax.transaction.RollbackException.class.getClass();
        ObjectStreamClass.lookup(javax.management.InstanceNotFoundException.class);
        ObjectStreamClass.lookup(javax.slee.management.SleeState.class);
        ObjectStreamClass.lookup(javax.slee.ServiceID.class);
        ObjectStreamClass.lookup(javax.slee.ServiceID[].class);
        ObjectStreamClass.lookup(javax.slee.profile.UnrecognizedProfileTableNameException.class);

    }
    private static ScriptEngine engine;
    static boolean debug;
    static boolean trace;

    public static void init() {
        ScriptEngineManager scriptEngineManager;
        scriptEngineManager = new ScriptEngineManager();

        if (debug) {

            System.err.println("available " + scriptEngineManager.getEngineFactories().stream().map(f -> f.getLanguageName() + " " + f.getEngineName() + " " + f.getEngineVersion()).collect(toList()).toString());
        }

        engine = scriptEngineManager.getEngineByName("Graal.js");

        if (engine == null) {
            if (debug) {
                System.err.println("fallback to default");
            }
            engine = scriptEngineManager.getEngineByName("js");
        }

        if (engine == null) {
            if (debug) {
                System.err.println("fallback to nashorn");
            }
            engine = scriptEngineManager.getEngineByName("nashorn");
        }

        if (engine != null && engine.getFactory() != null) {
            if (debug) {
                System.err.println(engine.ENGINE + " " + engine.toString());
            }
            ScriptEngineFactory factory = engine.getFactory();
            if (debug) {
                System.err.println("using " + factory.getEngineName() + " " + factory.getLanguageName());
                System.err.println(factory.getExtensions().toString());
            }
        }
    }

    public static void main(String[] args) throws ScriptException, IOException, URISyntaxException {

        //TestThis.main(args);
        eval(args);
    }

    public static void eval(String[] args) throws ScriptException, IOException, URISyntaxException {

        if (Boolean.getBoolean("js.debug")) {
            System.err.println(Arrays.asList(args).toString());
        }

        Iterator<String> i = Arrays.asList(args).iterator();
        File f = null;
        while (i.hasNext()) {
            //TODO: add help
            String arg = i.next().trim();

            if (arg.startsWith("--")) {
                String[] c = arg.substring(2).split("=");
                String name = c[0].trim();
                String value = null;
                if (c.length > 1) {
                    value = c[1].trim();
                } else if (name.equals("debug")) {
                    debug = true;
                    value = "true";
                } else if (name.equals("trace")) {
                    trace = true;
                    value = "true";
                }

                System.setProperty("js." + name, value);

                debug = Boolean.getBoolean("js.debug");
                trace = Boolean.getBoolean("js.trace");

                if (!name.equals("password")) {

                    if (debug) {
                        System.err.println(name + " " + value);
                    }
                }
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

        InputStream fin = null;
        debug = debug || Boolean.getBoolean("js.debug");

        String newName = null;
        if (f != null) {
            if (debug) {
                System.err.println("using file " + f.getAbsolutePath() + " exists: " + f.exists());
            }
            if (!f.exists()) {
                System.err.println("file not exists: " + f.getAbsolutePath());
                System.exit(1);
            }
            newName = f.getAbsolutePath();
            fin = new FileInputStream(f);
        }
        if (System.in.available() > 0) {
            if (debug) {
                System.err.println("got old stream");
            }
            newName = "stdin";

            fin = System.in;
        }
        if (System.inheritedChannel() != null) {
            if (debug) {
                System.err.println("got stream");
            }
            newName = "stdin";
            return;
        }

        if (fin == null) {
            System.err.println("usage jslee-js --debug --trace --username=wozza --password=wozza --url=service:jmx:remote+http://localhost:9990 < myfile.js");

        } else {

            FileSystem delegate = new MyFileSystem();
            //TODO use graal
            try (Context context = Context.newBuilder()
                    .allowNativeAccess(true)
                    .allowAllAccess(true)
                    .allowHostClassLoading(true)
                    .allowHostClassLookup(s -> true)
                    .allowHostAccess(HostAccess.ALL)
                    .allowIO(true)
                    //.allowExperimentalOptions(true)
                    //.option("js.nashorn-compat", "true")
                    .fileSystem(delegate)
                    .build()) {
                Value bindings = context.getBindings("js");
                bindings.putMember("js_username", System.getProperty("js.username"));
                bindings.putMember("js_password", System.getProperty("js.password"));
                bindings.putMember("js_url", System.getProperty("js.url"));
                bindings.putMember("js_debug", Boolean.getBoolean("js.debug"));
                bindings.putMember("js_trace", Boolean.getBoolean("js.trace"));

                Value eval = context.eval("js", "Java.type('javax.management.ObjectName')");
                if (eval.isNull()) {
                    throw new Exception("failed eval objectName");
                } else {
                    if (debug) {
                        System.err.println("have ObjectName " + eval.asHostObject());
                    }
                }
                Source source = Source.newBuilder("js", new InputStreamReader(fin), "main").mimeType("application/javascript+module").name(newName).build();
                if (debug) {
                    System.err.println("loaded source" + source.toString());
                }
                context.eval(source);
            } catch (PolyglotException x) {
                System.err.println("failed :" + x.getMessage() + " source: " + x.getSourceLocation());
                x.printStackTrace();
            } catch (Exception x) {
                System.err.println(x.getMessage());
                if (debug) {
                    x.printStackTrace();
                }

            } finally {

            }
        }

    }

    @HostAccess.Export
    public static String getProperty(String name) {
        return System.getProperty(name);
    }
}
