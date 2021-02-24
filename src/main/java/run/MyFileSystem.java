package run;


import java.io.IOException;
import java.net.URI;
import java.net.URL;
import java.net.URLConnection;
import java.nio.ByteBuffer;
import java.nio.channels.Channels;
import java.nio.channels.ReadableByteChannel;
import java.nio.channels.SeekableByteChannel;
import java.nio.file.AccessMode;
import java.nio.file.DirectoryStream;
import java.nio.file.FileSystemNotFoundException;
import java.nio.file.LinkOption;
import java.nio.file.OpenOption;
import java.nio.file.Path;
import java.nio.file.attribute.FileAttribute;
import java.util.Map;
import java.util.Set;
import org.graalvm.polyglot.io.FileSystem;

//Copied from Graal.
public class MyFileSystem implements FileSystem {

    static final String RESOURCE_SCHEME = "/resource:";
    static final String RESOURCE = "resource";
    static final String RESOURCE2 = "resource:";

    private volatile Path userDir;
    private FileSystem delegate;

    public MyFileSystem() {
        delegate = FileSystem.newDefaultFileSystem();
    }

    @Override
    public Path parsePath(URI uri) {
        try {
            return delegate.parsePath(uri);
        } catch (IllegalArgumentException | FileSystemNotFoundException e) {
            throw new UnsupportedOperationException(e);
        }
    }

    @Override
    public Path parsePath(String path) {
        return delegate.parsePath(path);
    }

    @Override
    public SeekableByteChannel newByteChannel(Path path, Set<? extends OpenOption> options, FileAttribute<?>... attrs) throws IOException {
        //System.err.println("nbc " + path.toString());
        if (path.toString().startsWith(RESOURCE_SCHEME)) {
            String name = path.toString().substring(10);
            URL resource = RunScript.class.getClassLoader().getResource(name);
            if (resource != null) {
                return new URLChannel(resource);
            }
        }

        final Path resolved = resolveRelative(path);
        //System.err.println("nbc " + resolved.toString());
        return delegate.newByteChannel(resolved, options, attrs);
    }

    @Override
    public Path toRealPath(Path path, LinkOption... linkOptions) throws IOException {
        //System.err.println("toRealPath" + path.toString());

        if (path.toString().startsWith(RESOURCE_SCHEME)) {
            try {
                String name = path.toString().substring(10);
                URL resource = RunScript.class.getClassLoader().getResource(name);
                if (resource != null) {
                    //System.err.println(resource.toURI().getScheme() + " " + resource.toURI() + " " + resource.toExternalForm() + " " + resource.toURI().toURL().toExternalForm());
                    if (resource.toURI().getScheme().equals(RESOURCE)) {
                        return path;
                    } else {
                        return path;
                    }
                } else {
                    System.err.println("can't find path " + path.toString() + " with " + name + " in classloader ");
                }
            } catch (Exception ex) {
                ex.printStackTrace();
            }

        } else if (path.toString().startsWith(RESOURCE)) {
            return path;
        }

        final Path resolvedPath = resolveRelative(path);
        return resolvedPath.toRealPath(linkOptions);
    }

    private Path resolveRelative(Path path) {
        return !path.isAbsolute() && userDir != null ? toAbsolutePath(path) : path;
    }

    @Override
    public void checkAccess(Path path, Set<? extends AccessMode> modes, LinkOption... linkOptions) throws IOException {
        delegate.checkAccess(path, modes, linkOptions);
    }

    @Override
    public void createDirectory(Path dir, FileAttribute<?>... attrs) throws IOException {
        delegate.createDirectory(dir, attrs);
    }

    @Override
    public void delete(Path path) throws IOException {
        delegate.delete(path);
    }

    @Override
    public DirectoryStream<Path> newDirectoryStream(Path dir, DirectoryStream.Filter<? super Path> filter) throws IOException {
        return delegate.newDirectoryStream(dir, filter);
    }

    @Override
    public Path toAbsolutePath(Path path) {
        return delegate.toAbsolutePath(path);
    }

    @Override
    public Map<String, Object> readAttributes(Path path, String attributes, LinkOption... options) throws IOException {
        return delegate.readAttributes(path, attributes, options);
    }

    //Copied from Jcodec
    class URLChannel implements SeekableByteChannel {

        private URL url;
        private ReadableByteChannel ch;
        private long pos;
        private long length;

        public URLChannel(URL url) {
            this.url = url;
        }

        @Override
        public long position() throws IOException {
            return pos;
        }

        @Override
        public SeekableByteChannel position(long newPosition) throws IOException {
            if (newPosition == pos) {
                return this;
            }
            if (ch != null) {
                ch.close();
                ch = null;
            }
            pos = newPosition;
            return this;
        }

        @Override
        public long size() throws IOException {
            return length;
        }

        @Override
        public SeekableByteChannel truncate(long size) throws IOException {
            throw new IOException("Truncate on HTTP is not supported.");
        }

        @Override
        public int read(ByteBuffer buffer) throws IOException {
            ensureOpen();
            int read = ch.read(buffer);
            if (read != -1) {
                pos += read;
            }
            return read;
        }

        @Override
        public int write(ByteBuffer buffer) throws IOException {
            throw new IOException("Write to HTTP is not supported.");
        }

        @Override
        public boolean isOpen() {
            return ch != null && ch.isOpen();
        }

        @Override
        public void close() throws IOException {
            ch.close();
        }

        private void ensureOpen() throws IOException {
            if (ch == null) {
                URLConnection connection = url.openConnection();
                ch = Channels.newChannel(connection.getInputStream());
            }
        }

    }
}
