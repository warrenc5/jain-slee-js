package run;

import java.io.BufferedInputStream;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.ObjectStreamClass;
import java.io.Reader;
import static java.lang.String.format;
import java.net.URISyntaxException;
import java.net.URL;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Scanner;
import java.util.Set;
import java.util.UUID;
import static java.util.stream.Collectors.toList;
import javax.script.ScriptEngine;
import javax.script.ScriptEngineFactory;
import javax.script.ScriptEngineManager;
import javax.script.ScriptException;
import org.graalvm.polyglot.Context;
import org.graalvm.polyglot.Engine;
import org.graalvm.polyglot.EnvironmentAccess;
import org.graalvm.polyglot.HostAccess;
import org.graalvm.polyglot.HostAccess.TargetMappingPrecedence;
import org.graalvm.polyglot.PolyglotAccess;
import org.graalvm.polyglot.PolyglotException;
import org.graalvm.polyglot.Source;
import org.graalvm.polyglot.Value;
import org.graalvm.polyglot.io.FileSystem;
import org.jboss.vfs.VirtualFile;

public class RunScript {

    private static boolean noexit;

    static {
        try {
            System.setProperty("jboss.threads.eqe.disable", Boolean.toString(true));
            javax.management.MBeanNotificationInfo.class.getClass();
            javax.transaction.RollbackException.class.getClass();
            javax.management.remote.JMXServiceURL.class.getClass();
            org.wildfly.security.sasl.util.PrivilegedSaslClientFactory.class.getClass();
            org.wildfly.security.sasl.util.PrivilegedSaslClient.class.getClass();
            ObjectStreamClass.lookup(java.util.HashSet.class);
            ObjectStreamClass.lookup(javax.management.InstanceNotFoundException.class);
            ObjectStreamClass.lookup(javax.management.MBeanException.class);
            ObjectStreamClass.lookup(javax.slee.management.SleeState.class);
            ObjectStreamClass.lookup(javax.slee.ServiceID.class);
            ObjectStreamClass.lookup(javax.slee.usage.SampleStatistics.class);
            ObjectStreamClass.lookup(javax.slee.ServiceID[].class);
            ObjectStreamClass.lookup(javax.slee.profile.UnrecognizedProfileTableNameException.class);
            ObjectStreamClass.lookup(javax.slee.InvalidArgumentException.class);
            ObjectStreamClass.lookup(java.util.Collections.class);
            ObjectStreamClass.lookup(org.jboss.remotingjmx.RemotingConnectorProvider.class);
            ObjectStreamClass.lookup(org.jboss.marshalling.river.RiverMarshaller.class);
        } catch (Throwable x) {
            x.printStackTrace();
            throw x;
        }

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

    static boolean nostdin;
    static boolean retry;

    static final int BUFFER_SIZE = 2048;
    static List<File> files = null;

    private static BufferedInputStream fin = null;
    private static String newName = null;

    public static void init() {
        ScriptEngineManager scriptEngineManager;
        scriptEngineManager = new ScriptEngineManager();
        if (debug) {

            System.err.println("available " + scriptEngineManager.getEngineFactories().stream().map(f -> f.getLanguageName() + " " + f.getEngineName() + " " + f.getEngineVersion()).collect(toList()).toString());
            System.err.println(UUID.randomUUID().toString());
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
        eval(args);
    }

    static ThreadLocal<Context> contextLocal;

    public static void eval(String[] args) throws ScriptException, IOException, URISyntaxException {

        if (Boolean.getBoolean("js.debug")) {
            System.err.println(Arrays.asList(args).toString());
        }

        System.err.println(Arrays.asList(args).toString());
        Iterator<String> i = Arrays.asList(args).iterator();
        files = new ArrayList<>();
        File f = null;
        while (i.hasNext()) {
            //TODO: add help
            String arg = i.next().trim();
            if (arg.trim().length() == 0) {
                System.err.println("skipping empty arg");
                continue;
            }

            if (arg.startsWith("--")) {
                String[] c = arg.substring(2).split("=");
                String name = c[0].trim();
                String value = null;
                if (c.length > 1) {
                    value = c[1].trim();
                } else if (name.equals("retry")) {
                    retry = true;
                    value = "true";
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
                } else if (name.equals("nostdin")) {
                    nostdin = true;
                    continue;
                } else if (name.equals("noexit")) {
                    noexit = true;
                    continue;
                }

                if (value == null) {
                    System.err.println(name + " was null");
                } else {
                    System.setProperty("js." + name, value);
                }

                debug = Boolean.getBoolean("js.debug");
                trace = Boolean.getBoolean("js.trace");
                retry = Boolean.getBoolean("js.retry");

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
                if (url == null) {
                    System.err.println("classpth resource not exists: " + u);
                    if (noexit) {
                        throw new IllegalArgumentException("classpth resource not exists: " + u);
                    } else {
                        System.exit(1);
                    }
                }
                System.err.println("found " + url.toURI());
                if (url.getProtocol().equals("vfs")) {
                    f = File.createTempFile(url.getPath() + "-", ".js");
                    System.err.println("rewriting vfs to " + f.toString());

                    VirtualFile vf = (VirtualFile) url.getContent();
                    InputStream is = vf.openStream();
                    FileOutputStream fos = new FileOutputStream(f);
                    while (is.available() > 0) {
                        fos.write(is.read());
                    }
                    fos.flush();
                    fos.close();
                    is.close();
                } else {
                    f = new File(url.toURI());
                }
                System.err.println("adding " + f.getAbsolutePath());
                files.add(f);
            } else {
                f = new File(arg);
                files.add(f);
                if (debug) {
                    System.err.println("using file " + f.getAbsolutePath() + " exists: " + f.exists());
                }
                if (!f.exists() && RunScript.class.getResource(f.getCanonicalPath()) == null) {
                    System.err.println("file not exists: " + f.getAbsolutePath());
                    if (noexit) {
                        return;
                    } else {
                        System.exit(1);
                    }
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

        debug = debug || Boolean.getBoolean("js.debug");

        init();
        if (!nostdin && System.in.available() > 0) {
            if (debug) {
                System.err.println("got stdin stream");
            }
            newName = "stdin";

            fin = new BufferedInputStream(System.in, BUFFER_SIZE);
        }
        if (System.inheritedChannel() != null) {
            if (debug) {
                System.err.println("got inherited channel stream");
            }
            newName = "stdin-inherited";
        }

        if (files.isEmpty() && fin == null) {
            System.err.println("no input file\nusage jmxjs --nostdin --debug --trace --username=wozza --password=wozza [--url=service:jmx:remote+http://localhost:9990] [--host=localhost] [--port=9990] [ somefile.js | classpath:some-class-loader-resource.js] < myfile.js");

        } else {
            processFiles(files);
        }
    }

    public static void processFiles(List<File> files) throws IOException {

        Engine engine = Engine.newBuilder()
                //JDK11.option("engine.WarnInterpreterOnly", "false")
                .option("log.file", File.createTempFile("jslee-js-truffle-", ".log").getAbsolutePath())
                .option("engine.WarnInterpreterOnly", Boolean.toString(false))
                //.option("java.PolyglotInterfaceMappings", getInterfaceMappings())
                .build();
        //FIXME typemappings
        FileSystem delegate = new MyFileSystem();
        //TODO use graal
        contextLocal = ThreadLocal.withInitial(() -> Context.newBuilder()
                .engine(engine)
                .allowNativeAccess(true)
                .allowAllAccess(true)
                .allowHostClassLoading(true)
                .allowHostClassLookup(s -> true)
                .allowHostAccess(HostAccess.newBuilder()
                        .allowPublicAccess(true)
                        .allowAllImplementations(true)
                        .allowAllClassImplementations(true)
                        .allowArrayAccess(true)
                        .allowListAccess(true)
                        /**
                        .allowAllClassImplementations(true)
                        .allowMapAccess(true)
                        .allowListAccess(true)
                        .allowPublicAccess(true)
                        .allowIterableAccess(true)
                        .allowIteratorAccess(true)
                        .allowBufferAccess(true)
                        .allowAccessInheritance(true)
                        .allowAllImplementations(true)
                        .targetTypeMapping(Value.class, Object.class, (v) -> v.hasArrayElements(), (v) -> transformArray(v))
                        .targetTypeMapping(Value.class, List.class, (v) -> v.hasArrayElements(), (v) -> transformArray(v))
                        //.targetTypeMapping(Value.class, Collection.class, (v) -> v.hasArrayElements(), (v) -> transformArray(v))
                        //.targetTypeMapping(Value.class, Map.class, (v) -> v.hasMembers(), (v) -> transformMembers(v)).targetTypeMapping(Value.class, Iterable.class, (v) -> v.hasArrayElements(), (v) -> transformArray(v))
                         */
                        //.targetTypeMapping(Value.class, String.class, v -> !v.isNull(), v -> v + "", TargetMappingPrecedence.LOWEST)
                        //.targetTypeMapping(Number.class, Integer.class, n -> true, n -> n.intValue(), TargetMappingPrecedence.LOWEST)
                        //.targetTypeMapping(Number.class, Double.class, n -> true, n -> n.doubleValue(), TargetMappingPrecedence.LOWEST)
                        .targetTypeMapping(Number.class, Object.class, n -> true, n -> n.longValue(), TargetMappingPrecedence.LOWEST)
                        //.targetTypeMapping(Number.class, Long.class, n -> true, n -> n.longValue(), TargetMappingPrecedence.LOWEST)
                        //.targetTypeMapping(Number.class, Boolean.class, n -> true, n -> n.doubleValue() != 0, TargetMappingPrecedence.LOWEST)
                        //.targetTypeMapping(String.class, Boolean.class, n -> true, n -> !n.isEmpty(), TargetMappingPrecedence.LOWEST)
                        //.targetTypeMapping(Double.class, Float.class, null, v -> v.floatValue(), HostAccess.TargetMappingPrecedence.HIGHEST)
                        .build())
                .allowHostAccess(HostAccess.ALL) //override the above
                .allowCreateThread(true)
                .allowIO(true)
                .allowExperimentalOptions(true)
                .allowPolyglotAccess(PolyglotAccess.ALL)
                .allowEnvironmentAccess(EnvironmentAccess.INHERIT)
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
            bindings.putMember("js_debug", debug || Boolean.getBoolean("js.debug"));
            bindings.putMember("js_trace", trace || Boolean.getBoolean("js.trace"));
            bindings.putMember("js_retry", retry || Boolean.getBoolean("js.retry"));
            bindings.putMember("debug", debug || Boolean.getBoolean("js.debug"));
            bindings.putMember("trace", trace || Boolean.getBoolean("js.trace"));
            bindings.putMember("retry", retry || Boolean.getBoolean("js.retry"));

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
            x.printStackTrace();
            System.err.println("failed2 :\"" + x.getMessage() + "\" (" + x.getClass().getName() + ") source: [" + newName + "] " + x.getSourceLocation()
                    + ", caused by: " + x.getCause());
            if (x.getCause() != null) {
                x.getCause().printStackTrace();
            }

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
            System.err.println("exited");
        }

    }

    @HostAccess.Export
    public static Long toLong(int i) {
        return Long.valueOf(Integer.toString(i));
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

    private static Map transformMembers(Value v) {
        Map map = new HashMap();
        for (String key : v.getMemberKeys()) {
            Value member = v.getMember(key);
            if (member.hasArrayElements() && !member.isHostObject()) {
                map.put(key, transformArray(member));
            } else if (member.hasMembers() && !member.isHostObject()) {
                map.put(key, transformMembers(member));
            } else {
                map.put(key, valueToObject(member));
            }
        }
        return map;
    }

    private static List transformArray(Value v) {
        List list = new ArrayList();
        for (int i = 0; i < v.getArraySize(); ++i) {
            Value element = v.getArrayElement(i);
            if (element.hasArrayElements() && !element.isHostObject()) {
                list.add(transformArray(element));
            } else if (element.hasMembers() && !element.isHostObject()) {
                list.add(transformMembers(element));
            } else {
                list.add(valueToObject(element));
            }
        }
        return list;
    }

    private static String getInterfaceMappings() {
        return "java.lang.Iterable;"
                + "java.util.Collection;"
                + "java.util.List;"
                + "java.util.Set;"
                + "java.util.Map;"
                + "java.util.Iterator;"
                + "java.util.Spliterator;";
    }

    private static Object valueToObject(Value member) {
        return member.as(java.lang.Object.class);
    }

}
