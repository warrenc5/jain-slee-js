package org.jboss.marshalling.reflect;

import com.oracle.svm.core.annotate.Alias;
import com.oracle.svm.core.annotate.TargetClass;
import com.oracle.svm.core.annotate.TargetElement;
import com.oracle.svm.core.jdk.JDK8OrEarlier;
import java.lang.reflect.Constructor;

@TargetClass(value = org.jboss.marshalling.reflect.JDKSpecific.class)
final class Target_org_jboss_marshalling_reflect_JDKSpecific1 {

    @Alias
    @TargetElement(onlyWith = JDK8OrEarlier.class) // Substitute only when Java version <= 8
    static Constructor<?> newConstructorForSerialization(Class<?> classToInstantiate, Constructor<?> constructorToCall) {
        Thread.dumpStack();
        return null;
    }

}
