package com.myjavatools.lib.foundation;

import java.io.*;
import java.util.*;

public class Sample1 {

  public static void main(String[] args) {
    String folderName = args.length < 1 ? "." : args[0];

    Map<String,String> fileToType =
        Maps.toMap("gif",  "image",
                   "jpg",  "image",
                   "jpeg", "image",
                   "png",  "image",
                   "java", "source code",
                   "cpp",  "source code",
                   "hpp",  "source code",
                   "class","binary",
                   "obj",  "binary",
                   "exe",  "binary",
                   "dll",  "library",
                   "lib",  "library",
                   "so",   "library",
                   "sl",   "library");

    Function<File,String> extension = new Function<File,String>() {
      public String apply(File file) {
        String name = file.getName();
        return name.substring(name.lastIndexOf('.') + 1);
      }
    };

    // the function returns file type for a file
    Function<File,String> fileType = Function.function(fileToType).compose(extension);

    // the list of files in the folder
    List<File> contents = Arrays.asList(new File(folderName).listFiles());

    // the same files grouped by their file types
    // only during this operation a new container is created.
    Map<String, Set<File>> filesGroupedByType =
        Maps.revert(fileType.toMap(contents));

    for (String type : filesGroupedByType.keySet()) {
      System.out.println(type + ":");
      for (File file : filesGroupedByType.get(type)) {
        System.out.println("  " + file);
      }
    }
  }
}
