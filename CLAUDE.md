    # CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is the myjavatools.com project - a collection of general-purpose Java tools and utilities published under public domain license. The codebase contains multiple versioned libraries (1.3.1 through 6.0) and specialized projects.

## Project Structure

The repository is organized into versioned releases in the `projects/` directory:

- **v.6.0/lib** - Latest version of the core utilities library (Foundation, Strings, Files, Web, Tools, etc.)
- **v.5.0/** - Contains lib and xml packages with comprehensive test suites
- **v.1.4.2/** - Earlier version with lib, web, xml, and jsp components
- **v.1.3.1/** - Legacy version
- **PracticalXML/** - Standalone XML interface implementation
- **Topos/** - Category theory implementation (Categories, Functors)
- **run/** - Java application for running code from URLs
- **macrojsp/** - Universal JSP macro system
- **systemJsp/** - Remote deployment JSP for JBoss
- **k/** - Appears to be a keyboard/UI testing project

Each versioned lib has a standard structure:
- `src/com/myjavatools/lib/` - Source files
- `test/com/myjavatools/lib/` - JUnit test files
- `doc/` - Javadoc documentation
- Pre-built JARs (mjlib.jar, mjlib-src.jar, mjlib-doc.jar)

## Key Components

### Foundation Package
Located in versioned libs under `com.myjavatools.lib.foundation`:
- Functional programming utilities (Function, Functions, Predicate, Filter)
- Immutable collections (AbstractImmutableSet, AbstractImmutableMap, AbstractImmutableCollection)
- Custom map implementations (FunctionalMap, KeyValuePairsMap, KeyValueArrayMap)
- Iterator utilities (CompoundIterator, ImmutableIterator, FunctionValueList)
- Utility classes (Objects, Pair, Logical)

### Core Utilities
- **Strings** - Perl-like string operations (split, join, replace, grep)
- **Files** - File system operations (find, copy, sync, relative paths) with for-each support
- **Web** - Network operations (downloadFile, getHtmlCharset, sendMail)
- **Tools** - General utilities (bark, inform, fatalError, runCommand)
- **FormattedWriter** - MessageFormat-based output
- **ZipInput** - Input from various sources

### XML Components
- **XmlData interface** - Contract for XML data structures (unidirectional hierarchy, no parent references)
- **Rss** - RSS feed handling (supports versions 0.90 through 2.0)
- Implementations in PracticalXML and versioned xml packages

### Web Package
- **ClientHttpRequest** - Sending multipart POST requests from Java
- **ServerHttpRequest** - Receiving multipart requests in servlets/JSP

## Building and Testing

This is a legacy Java project without modern build tools (no Maven pom.xml or Gradle files). Each versioned library is distributed as pre-built JARs.

### Running Tests
Tests use JUnit framework. To run tests for a specific version:
```bash
# Compile and run test suite
javac -cp <junit-jar>:projects/v.5.0/lib/src projects/v.5.0/lib/test/com/myjavatools/lib/AllTests.java
java -cp <junit-jar>:projects/v.5.0/lib/src:projects/v.5.0/lib/test junit.textui.TestRunner com.myjavatools.lib.AllTests
```

Test classes follow naming convention: `Test<ClassName>.java` (e.g., TestStrings, TestFiles, TestObjects)

### Working with JARs
Pre-built artifacts are available in each version directory:
- `mjlib.jar` - Compiled library
- `mjlib-src.jar` - Source code archive
- `mjlib-doc.jar` - Javadoc
- `mjlib<version>.zip` - Complete distribution

## Compatibility

Different versions target different JDK versions:
- v.1.3.1: JDK 1.3.1
- v.1.4.2: JDK 1.4.2
- v.5.0: JDK 5.0 (introduces generics in Foundation package)
- v.6.0: JDK 6.0

## Architecture Notes

### XmlData Design Philosophy
The XML interface uses unidirectional hierarchy - children have no knowledge of parent containers. This differs from DOM and simplifies handling by avoiding parent references.

### Foundation Package Design
Provides functional programming patterns for Java 5+:
- Functions as first-class values via Function interface
- Map-to-function and function-to-map conversions
- Composition of functions
- Iterable/Iterator enhancements with functional operations

### For-each Support
The Files utility provides enhanced for-each iteration:
```java
for(byte b : bytes(new FileInputStream("file"))) {}
for(char c : chars(new File("file"))) {}
for(String line : lines(new File("file"))) {}
for(File file : files(new File("."))) {}
for(File folder : tree(new File("."))) {}
```

## Additional Resources

- License: See `license.txt` in root directory (public domain)
- Forum: www.livejournal.com/community/myjavatools
- Articles referenced in README.md for specific components