package tests;

import java.io.IOException;
import java.lang.reflect.Constructor;
import java.net.MalformedURLException;
import java.util.HashMap;
import java.util.Map;
import javax.management.MBeanServerConnection;
import javax.management.remote.JMXConnector;
import javax.management.remote.JMXConnectorFactory;
import javax.management.remote.JMXServiceURL;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;
import org.junit.Before;
import org.junit.Ignore;
import org.junit.Test;

/**
 *
 * @author wozza
 */
public class MyTests {

    @Before
    public void init() {
    }

    @Test
    @Ignore
    public void testMapConstructor() {
        Constructor<?>[] ctors = java.util.AbstractMap.class.getConstructors();
        assertNotNull(ctors);
        assertTrue(ctors.length > 0);
    }

    @Test
    public void myTestRun() throws MalformedURLException, IOException {

        Map<String, Object> map = new HashMap();
        map.put("jmx.remote.credentials", new String[]{"admin", "admin"});
        JMXServiceURL url = new JMXServiceURL("service:jmx:remote+http://localhost:9990");
        System.out.println("1 " + url);
        JMXConnector connect = JMXConnectorFactory.newJMXConnector(url, map);
        System.out.println("2 " + connect);
        connect.connect();
        MBeanServerConnection mBeanServerConnection = connect.getMBeanServerConnection();
        System.out.println("HEre" + mBeanServerConnection);
        assertNotNull(mBeanServerConnection);
    }
}
