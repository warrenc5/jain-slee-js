package tests;

import java.io.IOException;
import java.io.InputStreamReader;
import java.net.URL;
import javax.script.ScriptEngineManager;
import javax.script.ScriptEngine;
import javax.script.ScriptException;
import javax.slee.management.ServiceState;
import org.junit.Assert;
import org.junit.Test;

public class RunScriptTest {

    @Test //TODO launch from classpath
    public void testScript() throws ScriptException, IOException {
        ScriptEngineManager scriptEngineManager = new ScriptEngineManager();
        ScriptEngine nashorn = scriptEngineManager.getEngineByName("nashorn");

        ServiceState ACTIVE = javax.slee.management.ServiceState.ACTIVE;
        System.setProperty("js.url", "service:jmx:remote+http://localhost:9990");
        System.setProperty("js.username", "wozza");
        System.setProperty("js.password", "wozza");
        URL url = this.getClass().getResource("/service-activate-deactivate.js");
        Assert.assertNotNull(url);
        Object result = nashorn.eval(new InputStreamReader(url.openStream()));
    }
}
