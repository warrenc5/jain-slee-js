
import java.io.IOException;
import java.net.URI;
import java.net.URL;
import java.net.URLConnection;
import java.nio.ByteBuffer;
import java.nio.channels.Channels;
import java.nio.channels.ReadableByteChannel;
import java.nio.channels.SeekableByteChannel;
import java.nio.file.AccessMode;
import java.nio.file.CopyOption;
import java.nio.file.DirectoryStream;
import java.nio.file.FileSystemNotFoundException;
import java.nio.file.LinkOption;
import java.nio.file.OpenOption;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.attribute.FileAttribute;
import java.nio.file.spi.FileSystemProvider;
import java.util.Iterator;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.concurrent.atomic.AtomicReference;
import org.graalvm.polyglot.io.FileSystem;

//Copied from Graal.
public class MyFileSystem implements FileSystem {

    private static final AtomicReference<FileSystemProvider> DEFAULT_FILE_SYSTEM_PROVIDER = new AtomicReference<>();
    private static final String TMP_FILE = System.getProperty("java.io.tmpdir");
    static final String FILE_SCHEME = "file";

    private final FileSystemProvider delegate;
    private final boolean explicitUserDir;
    private volatile Path userDir;
    private volatile Path tmpDir;

    MyFileSystem() {
        this(findDefaultFileSystemProvider(), false, null);
    }

    MyFileSystem(final FileSystemProvider fileSystemProvider) {
        this(fileSystemProvider, false, null);
    }

    MyFileSystem(final FileSystemProvider fileSystemProvider, final Path userDir) {
        this(fileSystemProvider, true, userDir);
    }

    private MyFileSystem(final FileSystemProvider fileSystemProvider, final boolean explicitUserDir, final Path userDir) {
        Objects.requireNonNull(fileSystemProvider, "FileSystemProvider must be non null.");
        this.delegate = fileSystemProvider;
        this.explicitUserDir = explicitUserDir;
        this.userDir = userDir;
    }

    @Override
    public Path parsePath(URI uri) {
        try {
            return delegate.getPath(uri);
        } catch (IllegalArgumentException | FileSystemNotFoundException e) {
            throw new UnsupportedOperationException(e);
        }
    }

    @Override
    public Path parsePath(String path) {
        if (!"file".equals(delegate.getScheme())) {
            throw new IllegalStateException("The ParsePath(String path) should be called only for file scheme.");
        }
        return Paths.get(path);
    }

    @Override
    public void checkAccess(Path path, Set<? extends AccessMode> modes, LinkOption... linkOptions) throws IOException {
        if (isFollowLinks(linkOptions)) {
            delegate.checkAccess(resolveRelative(path), modes.toArray(new AccessMode[modes.size()]));
        } else if (modes.isEmpty()) {
            delegate.readAttributes(path, "isRegularFile", LinkOption.NOFOLLOW_LINKS);
        } else {
            throw new UnsupportedOperationException("CheckAccess for NIO Provider is unsupported with non empty AccessMode and NOFOLLOW_LINKS.");
        }
    }

    @Override
    public void createDirectory(Path dir, FileAttribute<?>... attrs) throws IOException {
        delegate.createDirectory(resolveRelative(dir), attrs);
    }

    @Override
    public void delete(Path path) throws IOException {
        delegate.delete(resolveRelative(path));
    }

    @Override
    public void copy(Path source, Path target, CopyOption... options) throws IOException {
        delegate.copy(resolveRelative(source), resolveRelative(target), options);
    }

    @Override
    public void move(Path source, Path target, CopyOption... options) throws IOException {
        delegate.move(resolveRelative(source), resolveRelative(target), options);
    }

    @Override
    public SeekableByteChannel newByteChannel(Path path, Set<? extends OpenOption> options, FileAttribute<?>... attrs) throws IOException {
        //System.out.println("++++" + path.toString() + " " + path.toUri().toURL().toExternalForm());
        if (path.toString().startsWith("/resource:")) {
            String name = path.toString().substring(10);
            URL resource = RunScript.class.getClassLoader().getResource(name);
            if (resource != null) {
                return new URLChannel(resource);
            }
        }

        final Path resolved = resolveRelative(path);
        try {
            return delegate.newFileChannel(resolved, options, attrs);
        } catch (UnsupportedOperationException uoe) {
            return delegate.newByteChannel(resolved, options, attrs);
        }
    }

    @Override
    public DirectoryStream<Path> newDirectoryStream(Path dir, DirectoryStream.Filter<? super Path> filter) throws IOException {
        Path cwd = userDir;
        Path resolvedPath;
        boolean relativize;
        if (!dir.isAbsolute() && cwd != null) {
            resolvedPath = cwd.resolve(dir);
            relativize = true;
        } else {
            resolvedPath = dir;
            relativize = false;
        }
        DirectoryStream<Path> result = delegate.newDirectoryStream(resolvedPath, filter);
        if (relativize) {
            result = new RelativizeDirectoryStream(cwd, result);
        }
        return result;
    }

    @Override
    public void createLink(Path link, Path existing) throws IOException {
        delegate.createLink(resolveRelative(link), resolveRelative(existing));
    }

    @Override
    public void createSymbolicLink(Path link, Path target, FileAttribute<?>... attrs) throws IOException {
        delegate.createSymbolicLink(resolveRelative(link), resolveRelative(target), attrs);
    }

    @Override
    public Path readSymbolicLink(Path link) throws IOException {
        return delegate.readSymbolicLink(resolveRelative(link));
    }

    @Override
    public Map<String, Object> readAttributes(Path path, String attributes, LinkOption... options) throws IOException {
        return delegate.readAttributes(resolveRelative(path), attributes, options);
    }

    @Override
    public void setAttribute(Path path, String attribute, Object value, LinkOption... options) throws IOException {
        delegate.setAttribute(resolveRelative(path), attribute, value, options);
    }

    @Override
    public Path toAbsolutePath(Path path) {
        if (path.isAbsolute()) {
            return path;
        }
        Path cwd = userDir;
        if (cwd == null) {
            if (explicitUserDir) {  // Forbidden read of current working directory
                throw new SecurityException("Access to user.dir is not allowed.");
            }
            return path.toAbsolutePath();
        } else {
            return cwd.resolve(path);
        }
    }

    @Override
    public void setCurrentWorkingDirectory(Path currentWorkingDirectory) {
        Objects.requireNonNull(currentWorkingDirectory, "Current working directory must be non null.");
        if (explicitUserDir && userDir == null) { // Forbidden set of current working directory
            throw new SecurityException("Modification of current working directory is not allowed.");
        }
        userDir = currentWorkingDirectory;
    }

    @Override
    public Path toRealPath(Path path, LinkOption... linkOptions) throws IOException {
        //System.err.println(path.toString());

        try {
            if (path.toString().startsWith("/resource:")) {
                //Thread.dumpStack();
                String name = path.toString().substring(10);
                URL resource = RunScript.class.getClassLoader().getResource(name);
                if (resource != null) {
                    //System.err.println(resource.toURI().getScheme() + " " + resource.toURI() + " " + resource.toExternalForm() + " " + resource.toURI().toURL().toExternalForm());
                    if (resource.toURI().getScheme().equals("resource")) {
                        //path = Paths.get(resource.toURI().toString().toString());
                        return path;
                    } else if (resource.toURI().getScheme().equals("file")) {
                        path = Paths.get(resource.toURI());
                        return path;
                    }
                }

            } else if (path.toString().startsWith("resource:")) {
                //Thread.dumpStack();
                return path;
            }
        } catch (Exception ex) {
            ex.printStackTrace();
        }

        final Path resolvedPath = resolveRelative(path);
        return resolvedPath.toRealPath(linkOptions);
    }

    @Override
    public Path getTempDirectory() {
        Path result = tmpDir;
        if (result == null) {
            if (TMP_FILE == null) {
                throw new IllegalStateException("The java.io.tmpdir is not set.");
            }
            result = parsePath(TMP_FILE);
            tmpDir = result;
        }
        return result;
    }

    private Path resolveRelative(Path path) {
        return !path.isAbsolute() && userDir != null ? toAbsolutePath(path) : path;
    }

    private static final class RelativizeDirectoryStream implements DirectoryStream<Path> {

        private final Path folder;
        private final DirectoryStream<? extends Path> delegateDirectoryStream;

        RelativizeDirectoryStream(Path folder, DirectoryStream<? extends Path> delegateDirectoryStream) {
            this.folder = folder;
            this.delegateDirectoryStream = delegateDirectoryStream;
        }

        @Override
        public Iterator<Path> iterator() {
            return new RelativizeIterator(folder, delegateDirectoryStream.iterator());
        }

        @Override
        public void close() throws IOException {
            delegateDirectoryStream.close();
        }

        private static final class RelativizeIterator implements Iterator<Path> {

            private final Path folder;
            private final Iterator<? extends Path> delegateIterator;

            RelativizeIterator(Path folder, Iterator<? extends Path> delegateIterator) {
                this.folder = folder;
                this.delegateIterator = delegateIterator;
            }

            @Override
            public boolean hasNext() {
                return delegateIterator.hasNext();
            }

            @Override
            public Path next() {
                return folder.relativize(delegateIterator.next());
            }
        }
    }

    private static boolean isFollowLinks(final LinkOption... linkOptions) {
        for (LinkOption lo : linkOptions) {
            if (lo == LinkOption.NOFOLLOW_LINKS) {
                return false;
            }
        }
        return true;
    }

    private static FileSystemProvider findDefaultFileSystemProvider() {
        FileSystemProvider defaultFsProvider = DEFAULT_FILE_SYSTEM_PROVIDER.get();
        if (defaultFsProvider == null) {
            for (FileSystemProvider fsp : FileSystemProvider.installedProviders()) {
                if (FILE_SCHEME.equals(fsp.getScheme())) {
                    defaultFsProvider = fsp;
                    break;
                }
            }
            if (defaultFsProvider == null) {
                throw new IllegalStateException("No FileSystemProvider for scheme 'file'.");
            }
            DEFAULT_FILE_SYSTEM_PROVIDER.set(defaultFsProvider);
        }
        return defaultFsProvider;
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
