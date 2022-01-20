package org.jboss.marshalling.river;

import com.oracle.svm.core.annotate.TargetClass;

@TargetClass(value = org.jboss.marshalling.river.RiverUnmarshaller.class)
public final class Target_org_jboss_marshalling_river_RiverUnmarshaller {

    /**
     * *
     * Warning: RecomputeFieldValue.FieldOffset automatic substitution failed.
     * The automatic substitution registration was attempted because a call to
     * jdk.internal.misc.Unsafe.objectFieldOffset(Field) was detected in the
     * static initializer of org.jboss.marshalling.river.RiverUnmarshaller. Add
     * a RecomputeFieldValue.FieldOffset manual substitution for
     * org.jboss.marshalling.river.RiverUnmarshaller.proxyInvocationHandlerOffset.
     * Detailed failure reason(s): The argument of
     * Unsafe.objectFieldOffset(Field) is not a constant field. [
     */
    //@RecomputeFieldValue(kind = RecomputeFieldValue.Kind.FieldOffset)
    //private static long proxyInvocationHandlerOffset;
}
