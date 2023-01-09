package tests;

import java.io.IOException;
import java.net.URISyntaxException;
import javax.script.ScriptException;
import org.junit.Ignore;
import org.junit.Test;
import run.RunScript;

public class RunScriptTest {

    @Test
    @Ignore
    public void testRunScript() throws ScriptException, IOException, URISyntaxException {
        RunScript.main("--nostdin --url service:jmx:remote+http://172.25.0.2:9990 --username admin --password admin classpath:/usage.js".split(" "));
    }

    @Test
    public void testRunScript2() throws ScriptException, IOException, URISyntaxException {
        RunScript.main("--nostdin classpath:/sccpaddress.js".split(" "));
    }
}