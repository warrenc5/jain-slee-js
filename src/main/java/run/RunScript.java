package run;

import java.io.BufferedInputStream;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.ObjectStreamClass;
import java.io.Reader;
import static java.lang.String.format;
import java.net.URISyntaxException;
import java.net.URL;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Iterator;
import java.util.List;
import java.util.Scanner;
import java.util.Set;
import static java.util.stream.Collectors.toList;
import javax.script.ScriptEngine;
import javax.script.ScriptEngineFactory;
import javax.script.ScriptEngineManager;
import javax.script.ScriptException;
import org.graalvm.polyglot.Context;
import org.graalvm.polyglot.HostAccess;
import org.graalvm.polyglot.PolyglotAccess;
import org.graalvm.polyglot.PolyglotException;
import org.graalvm.polyglot.Source;
import org.graalvm.polyglot.Value;
import org.graalvm.polyglot.io.FileSystem;

public class RunScript {

    static {
        System.setProperty("jboss.threads.eqe.disable", Boolean.toString(true));

        javax.management.MBeanNotificationInfo.class.getClass();
        javax.transaction.RollbackException.class.getClass();
        javax.management.remote.JMXServiceURL.class.getClass();

        ObjectStreamClass.lookup(java.util.HashSet.class);
        ObjectStreamClass.lookup(javax.management.InstanceNotFoundException.class);
        ObjectStreamClass.lookup(javax.management.MBeanException.class);
        ObjectStreamClass.lookup(javax.slee.management.SleeState.class);
        ObjectStreamClass.lookup(javax.slee.ServiceID.class);
        ObjectStreamClass.lookup(javax.slee.ServiceID[].class);
        ObjectStreamClass.lookup(javax.slee.profile.UnrecognizedProfileTableNameException.class);
        ObjectStreamClass.lookup(javax.slee.InvalidArgumentException.class);
        ObjectStreamClass.lookup(java.util.Collections.class);
        ObjectStreamClass.lookup(javax.management.remote.JMXServiceURL.class);

        /**
        try {
            ObjectStreamClass.lookup(org.jboss.remotingjmx.RemotingConnectorProvider.class);
            org.jboss.remotingjmx.RemotingConnectorProvider p = new org.jboss.remotingjmx.RemotingConnectorProvider();
            p.newJMXConnector(null, null);
        } catch (Throwable t) {
        }
*/
    }

    private static ScriptEngine engine;
    static boolean debug;
    static boolean trace;

    static final int BUFFER_SIZE = 2048;
    static List<File> files = null;

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

    static ThreadLocal<Context> contextLocal;

    public static void eval(String[] args) throws ScriptException, IOException, URISyntaxException {

        if (Boolean.getBoolean("js.debug")) {
            System.err.println(Arrays.asList(args).toString());
        }

        Iterator<String> i = Arrays.asList(args).iterator();
        files = new ArrayList<>();
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
                } else if (name.equals("username")) {
                    value = i.next();
                } else if (name.equals("password")) {
                    value = i.next();
                } else if (name.equals("host")) {
                    value = i.next();
                } else if (name.equals("port")) {
                    value = i.next();
                } else if (name.equals("url")) {
                    value = i.next();
                }

                if (value == null) {
                    System.err.println(name + "  was null");
                } else {
                    System.setProperty("js." + name, value);
                }

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
                files.add(f);
            } else {
                f = new File(arg);
                files.add(f);
                if (debug) {
                    System.err.println("using file " + f.getAbsolutePath() + " exists: " + f.exists());
                }
                if (!f.exists()) {
                    System.err.println("file not exists: " + f.getAbsolutePath());
                    System.exit(1);
                }
            }
        }

        //System.setProperty("polyglot.engine.WarnInterpreterOnly","false");
        if (System.getProperty("js.host") == null) {
            System.setProperty("js.host", "localhost");
        }

        if (System.getProperty("js.port") == null) {
            System.setProperty("js.port", "9990");
        }

        if (System.getProperty("js.url") == null) {
            System.setProperty("js.url", "service:jmx:remote+http://" + System.getProperty("js.host") + ":" + System.getProperty("js.port"));
        }

        if (System.getProperty("js.username") == null) {
            System.setProperty("js.username", "admin");
        }

        String value = null;
        if ((value = System.getProperty("js.password")) != null && value.equals("-")) {
            System.err.println("enter password");
            String password = new Scanner(System.in).nextLine();
            System.setProperty("js.password", password);
        }

        if (System.getProperty("js.password") == null) {
            System.setProperty("js.password", "admin");
        }

        BufferedInputStream fin = null;
        debug = debug || Boolean.getBoolean("js.debug");

        init();
        String newName = null;
        if (System.in.available() > 0) {
            if (debug) {
                System.err.println("got old stream");
            }
            newName = "stdin";

            fin = new BufferedInputStream(System.in, BUFFER_SIZE);
        }
        if (System.inheritedChannel() != null) {
            if (debug) {
                System.err.println("got stream");
            }
            newName = "stdin-inherited";
        }

        if (files.isEmpty() && fin == null) {
            System.err.println("no input file\nusage jmxjs --debug --trace --username=wozza --password=wozza [--url=service:jmx:remote+http://localhost:9990] [--host=localhost] [--port=9990] somefile.js < myfile.js");

        } else {
            FileSystem delegate = new MyFileSystem();
            //TODO use graal
            contextLocal = ThreadLocal.withInitial(() -> Context.newBuilder()
                    .allowNativeAccess(true)
                    .allowAllAccess(true)
                    .allowHostClassLoading(true)
                    .allowHostClassLookup(s -> true)
                    .allowHostAccess(HostAccess.ALL)
                    .allowIO(true)
                    .allowExperimentalOptions(true)
                    .allowPolyglotAccess(PolyglotAccess.ALL)
                    //.option("js.nashorn-compat", "true")
                    .logHandler(System.out)
                    //.currentWorkingDirectory(Paths.get(System.getProperty("js.dir", ".")).toAbsolutePath())
                    .err(System.err)
                    .fileSystem(delegate)
                    .build());

            try (Context context = contextLocal.get()) {
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

                String mime = null;
                if (fin != null) {
                    BufferedReader fr = new BufferedReader(new InputStreamReader(fin));
                    mime = detectMimeType(fr);
                    newName = "stdin";

                    processSource(newName, fr, context, mime);
                }

                for (File f2 : files) {
                    newName = f2.getAbsolutePath();
                    if (debug) {
                        System.err.println(newName);
                    }
                    BufferedReader fr = new BufferedReader(new FileReader(f2), BUFFER_SIZE * 2);
                    mime = detectMimeType(fr);
                    processSource(newName, fr, context, mime);
                }

            } catch (PolyglotException x) {
                System.err.println("failed :" + x.getMessage() + " source: " + x.getSourceLocation());
                System.err.println(Arrays.asList(x.getPolyglotStackTrace()).toString());
                if (trace) {
                    x.printStackTrace();
                }
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

    private static void processSource(String newName, Reader fin, Context context, String mime) throws IOException {
        Source source = Source.newBuilder("js", fin, newName).mimeType(mime).name(newName).cached(true).build();

        if (source == null) {
            System.err.println(format("source built to null %s %s", newName, mime));
        }

        if (debug) {
            System.err.println("loaded source" + source.toString());
        }

        Value result = context.eval(source);

        if (result.hasMembers()) {
            Set<String> members = result.getMemberKeys();
            for (String member : members) {
                if (trace) {
                    System.err.println("copy bindings " + member);
                }
                context.getBindings("js").putMember(member, result.getMember(member));
            }
        }

        if (trace) {
            System.err.println("bindings " + context.getBindings("js").getMemberKeys().toString());
        }
    }

    private static String detectMimeType(BufferedReader fin) throws IOException {
        String mime = "application/javascript";
        if (!fin.markSupported()) {
            return mime;
        }
        fin.mark(BUFFER_SIZE);
        Scanner scanner = new Scanner(fin);
        if (null != scanner.findWithinHorizon("^\\w*import", BUFFER_SIZE / 3)) {
            mime = Source.findMimeType(new File("test.mjs"));
        }
        fin.reset();
        return mime;
    }
}
