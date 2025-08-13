package com.myjavatools.lib.foundation;

import java.io.*;
import java.util.*;

import static com.myjavatools.lib.foundation.Functions.*;
import static com.myjavatools.lib.foundation.Maps.*;

/**
 * <p>Title: My Java Tools Library</p>
 *
 * <p>Description: This is a mixture of useful Java Tools</p>
 *
 * <p>Copyright: This is public domain; The right of people to use, distribute,
 * copy or improve the contents of the following may not be restricted.</p></p>
 *
 * <p>Company: My Java Tools</p>
 *
 * @author vlad@myjavatools.com
 * @version 5.0
 */
public class mapexample {

  public static int makemyday(Object... arg) {
    return arg.length;
  }

  public static void main(String[] args) {
    int i = makemyday(new Object[]{"a", "b", "c"});

    Function<File,String> extension = new Function<File,String>() {
      public String apply(File file) {
        String name = file.getName();
        return name.indexOf('.') < 0 ? "" :
               name.substring(name.lastIndexOf('.') + 1);
      }
    };

    File folder = new File(".");
    Map<String,String> extensionToType = arrayToMap(args);
    File[] fileList = folder.listFiles();
    Map<File,String> fileToType = compose(extension.toMap(Arrays.asList(fileList)), extensionToType);

    Map<String, Set<File>> typeToFiles = revert(fileToType);

    System.out.println("--- " + folder.getAbsolutePath() + " ---");
    for (File file : fileList) {
      System.out.println(file + ": " + fileToType.get(file));
    }

    System.out.println("--------------------------");
    for (String type : typeToFiles.keySet()) {
      System.out.println(type);
      for (File file : typeToFiles.get(type)) {
        System.out.println("  " + file);
      }
    }
  }
}
