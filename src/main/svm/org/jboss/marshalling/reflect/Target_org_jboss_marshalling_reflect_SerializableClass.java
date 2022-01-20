package org.jboss.marshalling.reflect;

import com.oracle.svm.core.annotate.Substitute;
import com.oracle.svm.core.annotate.TargetClass;
import java.io.ObjectStreamClass;
import java.io.ObjectStreamField;
import java.lang.reflect.Constructor;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Modifier;
import java.util.HashSet;

@TargetClass(org.jboss.marshalling.reflect.SerializableClass.class)
@SuppressWarnings({"unused"})
final class Target_org_jboss_marshalling_reflect_SerializableClass {

    @Substitute
    public static ObjectStreamField[] getDeclaredSerialPersistentFields(Class<?> clazz) {
        ObjectStreamClass lookup = ObjectStreamClass.lookup(clazz);
        if (lookup != null) {
            return lookup.getFields();
        } else {
            return new ObjectStreamField[0];
        }

    }

    @Substitute
    public static <T> T invokeConstructorNoException(Constructor<T> constructor, Object... args) {
        if (constructor == null) {
            throw new IllegalArgumentException("No matching constructor");
        }
        try {
            if (Modifier.isAbstract(constructor.getDeclaringClass().getModifiers())) {
                System.err.println("this is mine " + constructor.toGenericString());
                return (T) HashSet.class.getConstructor(new Class[]{}).newInstance(args);
            } else
            return constructor.newInstance(args);
        } catch (InvocationTargetException e) {
            final Throwable te = e.getTargetException();
            if (te instanceof RuntimeException) {
                System.err.println("this is mine " + constructor.toGenericString());
                throw (RuntimeException) te;
            } else if (te instanceof Error) {
                System.err.println("this is mine " + constructor.toGenericString());
                throw (Error) te;
            } else {
                System.err.println("this is mine " + constructor.toGenericString());
                throw new IllegalStateException("Unexpected exception", te);
            }
        } catch (InstantiationException e) {
            System.err.println("this is mine " + constructor.toGenericString());
            throw new IllegalStateException("Instantiation failed unexpectedly", e);
        } catch (IllegalAccessException e) {
            System.err.println("this is mine " + constructor.toGenericString());
            throw new IllegalStateException("Constructor is unexpectedly inaccessible", e);
        } catch (NoSuchMethodException e) {

            System.err.println("this is mine " + constructor.toGenericString());
            throw new IllegalStateException("Nosuch method", e);
        } catch (SecurityException e) {
            System.err.println("this is mine " + constructor.toGenericString());
            throw new IllegalStateException("security ", e);
        }
    }

}
