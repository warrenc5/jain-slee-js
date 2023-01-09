package web;

import javax.management.MXBean;

@MXBean
public interface RunScriptMBean {

    static String OBJECT_NAME = "mofokom:type=RunScript";
    boolean run(String ... args) throws Exception;
}
