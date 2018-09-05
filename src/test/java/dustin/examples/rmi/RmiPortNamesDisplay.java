package dustin.examples.rmi;

import java.rmi.AccessException;
import java.rmi.ConnectException;
import java.rmi.NotBoundException;
import java.rmi.RemoteException;
import java.rmi.registry.LocateRegistry;
import java.rmi.registry.Registry;
import java.util.Arrays;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * Display names bound to RMI registry on provided host and port.
 */
public class RmiPortNamesDisplay {

    private final static String NEW_LINE = System.getProperty("line.separator");

    /**
     * Main executable function for printing out RMI registry names on provided
     * host and port.
     *
     * @param arguments Command-line arguments; Two expected: first is a String
     * representing a host name ('localhost' works) and the second is an integer
     * representing the port.
     */
    public static void main(final String[] arguments) {
        if (arguments.length < 2) {
            System.err.println(
                    "A host name (String) and a port (Integer) must be provided.");
            System.err.println(
                    "\tExample: java dustin.examples.rmi.RmiPortNamesDisplay localhost 1099");
            System.exit(-2);
        }

        final String host = arguments[0];
        int port = 1099;
        try {
            port = Integer.valueOf(arguments[1]);
        } catch (NumberFormatException numericFormatEx) {
            System.err.println(
                    "The provided port value [" + arguments[1] + "] is not an integer."
                    + NEW_LINE + numericFormatEx.toString());
        }

        try {
            final Registry registry = LocateRegistry.getRegistry(host, port);
            final String[] boundNames = registry.list();
            System.out.println(
                    "Names bound to RMI registry at host " + host + " and port " + port + ":");
            for (final String name : boundNames) {
                System.out.println("\t" + name);
                try {
                    System.out.println(Arrays.asList(registry.lookup(name).getClass().getInterfaces()).toString());
                } catch (NotBoundException ex) {
                    Logger.getLogger(RmiPortNamesDisplay.class.getName()).log(Level.SEVERE, null, ex);
                } catch (AccessException ex) {
                    Logger.getLogger(RmiPortNamesDisplay.class.getName()).log(Level.SEVERE, null, ex);
                }
            }
        } catch (ConnectException connectEx) {
            connectEx.printStackTrace();
            System.err.println(
                    "ConnectionException - Are you certain an RMI registry is available at port "
                    + port + "?" + NEW_LINE + connectEx.toString());
        } catch (RemoteException remoteEx) {
            remoteEx.printStackTrace();
            System.err.println("RemoteException encountered: " + remoteEx.toString());
        }
    }
}
