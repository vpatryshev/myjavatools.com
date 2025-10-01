package com.myjavatools.lib;

import junit.framework.*;

public class Fixtures
        extends TestCase {

    String os = System.getProperty("os.name").toLowerCase();
    boolean isWindows = os.contains("win");
    boolean isMac = os.contains("mac");
    boolean isLinux = os.contains("nix") || os.contains("nux");
    public Fixtures(String name) {
        super(name);
    }

}
