package run;

import com.oracle.truffle.espresso.polyglot.GuestTypeConversion;

/**
 *
 * @author wozza
 */
public class ArrayConversion implements GuestTypeConversion {

    @Override
    public Object toGuest(Object polyglotInstance) {
        Thread.dumpStack();
        throw new UnsupportedOperationException("Not supported yet.");
    }

}
