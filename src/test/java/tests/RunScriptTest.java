package tests;

import java.io.IOException;
import java.net.URISyntaxException;
import javax.script.ScriptException;
import org.junit.Ignore;
import org.junit.Test;
import run.RunScript;

public class RunScriptTest {

    @Test
    public void testRunScript() throws ScriptException, IOException, URISyntaxException {
        RunScript.main("--retry --nostdin --url service:jmx:remote+http://172.27.0.22:9990 --username admin --password admin classpath:/usage.js".split(" "));
    }

    @Test
    public void testRetry() throws ScriptException, IOException, URISyntaxException {
        RunScript.main("--retry --debug --trace --nostdin --host 172.27.0.22 --username admin --password admin classpath:/usage.js".split(" "));
    }

    @Test
    public void testLocal() throws ScriptException, IOException, URISyntaxException {
        RunScript.main("--retry --debug --trace --nostdin --host 172.27.0.22 --username admin --password admin classpath:/ra-reconfigure.js".split(" "));
    }

    @Test
    @Ignore
    public void testRunScript2() throws ScriptException, IOException, URISyntaxException {
        RunScript.main("--nostdin classpath:/sccpaddress.js".split(" "));
    }
}