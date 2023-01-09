package run;

import java.io.File;
import java.lang.instrument.Instrumentation;
import java.lang.reflect.Method;
import java.net.URL;
import java.net.URLClassLoader;
import java.nio.file.Path;
import java.util.Arrays;
import java.util.jar.JarFile;

public class Agent {

    private static Instrumentation inst = null;

    public static void agentmain(final String a, final Instrumentation inst) {
        System.out.println("agent initialized " + a);
        Agent.inst = inst;

        Arrays.stream(System.getProperty("classpath", "").split(File.pathSeparator)).filter(s -> !s.isEmpty()).forEach(p -> {
            try {
                Agent.addClassPath(p);
            } catch (Exception x) {
                x.printStackTrace();
            }
        });
    }

    public static boolean addClassPath(String path) throws Exception {
        //addClassPath(Path.of(path));
        Thread.dumpStack();
        return true;
    }

    public static boolean addClassPath(Path path) throws Exception {
        /*
        URLClassLoader cl;
        cl = new URLClassLoader(new URL[]{path.toUri().toURL()});
        System.out.println(Arrays.asList(cl.getURLs()));
         */
        if (path.toFile().exists() && path.toFile().isDirectory()) {
        //System.out.println("adding directory " + path.toString());
            Arrays.stream(path.toFile().listFiles((dir, name) -> new File(dir,name).isDirectory() || name.matches(".*\\.jar$"))).forEach(
                    f -> {
                        try {
                            addClassPath(f.toPath());
                        } catch (Exception ex) {
                            ex.printStackTrace();
                        }
                    });
            return true;
        } else {
            return addClassPath(path.toFile());
        }
    }

    public static boolean addClassPath(File f) throws Exception {
        //System.out.println("adding " + f);
        ClassLoader cl = ClassLoader.getSystemClassLoader();

        if (cl instanceof URLClassLoader) {
            
            // If Java 8 or below fallback to old method
            Method m = URLClassLoader.class.getDeclaredMethod("addURL", URL.class);
            m.setAccessible(true);
            m.invoke(cl, f.toURI().toURL());
            return true;
        } else if (inst != null) {
            // If Java 9 or higher use Instrumentation
            inst.appendToSystemClassLoaderSearch(new JarFile(f));
            return true;
        } 
        return false;
    }

}
