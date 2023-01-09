package web;

import java.io.IOException;
import java.io.PrintWriter;
import java.lang.management.ManagementFactory;
import static java.util.logging.Level.SEVERE;
import static java.util.logging.Level.WARNING;
import java.util.logging.Logger;
import javax.inject.Inject;
import javax.management.MBeanServer;
import javax.management.MalformedObjectNameException;
import javax.management.ObjectName;
import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 *
 * @author wozza
 */
@WebServlet(urlPatterns = "/*", loadOnStartup = 1)
public class RunScriptServlet extends HttpServlet {

    Logger log = Logger.getLogger(RunScriptServlet.class.getName());
    private MBeanServer mbeanServer;
    private final ObjectName runScriptMBean;

    @Inject
    private RunScriptMBean runScript;
    private int OK = 200;
    private int FAIL = 506;

    public RunScriptServlet() throws MalformedObjectNameException {
        this.runScriptMBean = new ObjectName(RunScript.OBJECT_NAME);
    }

    @Override
    public void init(ServletConfig config) throws ServletException {
        super.init(config);
        mbeanServer = ManagementFactory.getPlatformMBeanServer();
        try {
            runScript.run("classpath:/js/simple.js");
        } catch (Exception ex) {
            log.log(SEVERE,ex.getMessage(),ex);
        }
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("text/html;charset=UTF-8");
        double upCount;
        String statusMessage = "UNKNOWN";
        int status = 500;

        try {
            runScript.run();
            status = OK;
            statusMessage = "OK";

        } catch (Exception ex) {
            log.log(WARNING, ex.getMessage(), ex);
        }

        response.setStatus(status);

        PrintWriter out = response.getWriter();
        try {
            out.println(statusMessage);
        } finally {
            out.close();
        }
    }

    @Override
    public String getServletInfo() {
        return "JS JMX RunScript";
    }
}
