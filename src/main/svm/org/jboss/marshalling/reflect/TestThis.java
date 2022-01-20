package org.jboss.marshalling.reflect;

import java.io.ObjectStreamClass;
import java.util.EnumSet;
import java.util.HashSet;

public class TestThis {

    //https://github.com/oracle/graal/issues/3156#issuecomment-768906789
    public static void main(String[] args) {
        /**
         * try { ReflectionFactory reflFactory = AccessController.doPrivileged(
         * new ReflectionFactory.GetReflectionFactoryAction());
         *
         * Constructor<?> c =
         * reflFactory.newConstructorForSerialization(java.util.EnumSet.class);
         * System.out.println(c.toGenericString()); } catch (Exception x) {
         * System.out.println(x.getMessage()); }
         */
        try {
            ObjectStreamClass.lookup(javax.management.InstanceNotFoundException.class);
            System.err.println("INF WORKS");

            SerializableClass lookup = org.jboss.marshalling.reflect.SerializableClassRegistry.getInstance().lookup(javax.management.InstanceNotFoundException.class);

            System.err.println("lookup " + lookup);
        } catch (Throwable x) {
            x.printStackTrace();
        }

        try {
            ObjectStreamClass.lookup(java.util.AbstractSet.class);
            System.err.println("AbstractSet WORKS");
        } catch (Throwable x) {
            x.printStackTrace();
        }
        try {
            ObjectStreamClass.lookup(EnumSet.class);
            System.err.println("EnumSet WORKS");
        } catch (Throwable x) {
            x.printStackTrace();
        }
        try {
            ObjectStreamClass.lookup(HashSet.class);
            System.err.println("HashSet WORKS");
        } catch (Throwable x) {
            x.printStackTrace();
        }
    }

}
