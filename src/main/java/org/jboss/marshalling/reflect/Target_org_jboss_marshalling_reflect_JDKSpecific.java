package org.jboss.marshalling.reflect;

import com.oracle.svm.core.annotate.Substitute;
import com.oracle.svm.core.annotate.TargetClass;
import java.lang.reflect.Constructor;
import java.lang.reflect.Modifier;
import java.util.AbstractSet;
import java.util.HashSet;

@TargetClass(value = org.jboss.marshalling.reflect.JDKSpecific.class)
final class Target_org_jboss_marshalling_reflect_JDKSpecific {

    @Substitute(polymorphicSignature = false)
    static Constructor<?> newConstructorForSerialization(Class<?> classToInstantiate, Constructor<?> constructorToCall) {

        System.out.println(classToInstantiate.getName() + " " + constructorToCall.toGenericString());
        try {
            if (classToInstantiate.equals(java.util.EnumSet.class) || constructorToCall.getDeclaringClass().equals(AbstractSet.class)) {
                System.out.println("YES");
                return HashSet.class.getConstructor(new Class[0]);
            }
            if (constructorToCall != null) {
                return constructorToCall;
            } else if (Modifier.isAbstract(classToInstantiate.getModifiers())) {
                return Object.class.getDeclaredConstructor(new Class[0]);
            } else {
                return classToInstantiate.getConstructor(new Class[0]);
            }
        } catch (NoSuchMethodException ex) {
            ex.printStackTrace();
        } catch (SecurityException ex) {
            ex.printStackTrace();
        }
        return null;
    }

}
