
import java.io.ObjectStreamClass;
import java.util.EnumSet;

public class TestThis {

    //https://github.com/oracle/graal/issues/3156#issuecomment-768906789
    public static void main(String[] args) {
        /**
           try {
            ReflectionFactory reflFactory = AccessController.doPrivileged(
                    new ReflectionFactory.GetReflectionFactoryAction());

            Constructor<?> c = reflFactory.newConstructorForSerialization(java.util.EnumSet.class);
            System.out.println(c.toGenericString());
        } catch (Exception x) {
            System.out.println(x.getMessage());
        }
         */

        try {
            ObjectStreamClass.lookup(java.util.AbstractSet.class);
            System.out.println("AbstractSet WORKS");
        } catch (Exception x) {
            System.out.println(x.getMessage());
        }
        try {
            ObjectStreamClass.lookup(EnumSet.class);
            System.out.println("EnumSet WORKS");

        } catch (Exception x) {
            System.out.println(x.getMessage());
        }
    }

}
