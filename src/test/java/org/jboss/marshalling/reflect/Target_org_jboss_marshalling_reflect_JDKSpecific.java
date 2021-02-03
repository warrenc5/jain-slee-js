package org.jboss.marshalling.reflect;

import com.oracle.svm.core.annotate.Substitute;
import com.oracle.svm.core.annotate.TargetClass;
import com.oracle.svm.core.annotate.TargetElement;
import com.oracle.svm.core.jdk.JDK8OrEarlier;
import java.lang.reflect.Constructor;
import jdk.internal.reflect.ReflectionFactory;
import static jdk.internal.reflect.ReflectionFactory.getReflectionFactory;

@TargetClass(value = org.jboss.marshalling.reflect.JDKSpecific.class)
final class Target_org_jboss_marshalling_reflect_JDKSpecific {

    @Substitute(polymorphicSignature = false)
    @TargetElement(onlyWith = JDK8OrEarlier.class) // Substitute only when Java version <= 8
    static Constructor<?> newConstructorForSerialization(Class<?> classToInstantiate, Constructor<?> constructorToCall) {

        System.out.println(classToInstantiate.getName() + " " + constructorToCall.toGenericString());
        //return Target_org_jboss_marshalling_reflect_JDKSpecific1.newConstructorForSerialization(classToInstantiate, constructorToCall);
        ReflectionFactory reflectionFactory = getReflectionFactory();
        return reflectionFactory.newConstructorForSerialization(classToInstantiate);
    }

}
