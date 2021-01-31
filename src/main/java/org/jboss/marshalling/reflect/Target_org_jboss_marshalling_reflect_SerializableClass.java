package org.jboss.marshalling.reflect;

import com.oracle.svm.core.annotate.Substitute;
import com.oracle.svm.core.annotate.TargetClass;
import java.io.ObjectStreamClass;
import java.io.ObjectStreamField;

@TargetClass(org.jboss.marshalling.reflect.SerializableClass.class)
@SuppressWarnings({"unused"})
final class Target_org_jboss_marshalling_reflect_SerializableClass {

    @Substitute(polymorphicSignature = false)
    public static ObjectStreamField[] getDeclaredSerialPersistentFields(Class<?> clazz) {
        return ObjectStreamClass.lookup(clazz).getFields();
    }

}
