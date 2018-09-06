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
import org.junit.Test;

/**
 * Display names bound to RMI registry on provided host and port.
 */
public class RmiPortNamesDisplay {

    private final static String NEW_LINE = System.getProperty("line.separator");

    @Test
    public void listRmiTest() {

        final String host = "localhost";
        int port = 1099;

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
