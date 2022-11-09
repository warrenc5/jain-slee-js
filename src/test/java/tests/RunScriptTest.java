package tests;

import java.io.IOException;
import java.net.URISyntaxException;
import javax.script.ScriptException;
import org.junit.Test;
import run.RunScript;

public class RunScriptTest {

    @Test
    public void testRunScript() throws ScriptException, IOException, URISyntaxException {
        RunScript.main("--nostdin --url service:jmx:remote+http://172.25.0.2:9990 --username admin --password admin classpath:/usage.js".split(" "));
    }
}