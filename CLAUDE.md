    # CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is the myjavatools.com project - a collection of general-purpose Java tools and utilities published under public domain license.

## Project Structure

The project uses standard Maven directory structure:

- **src/main/java/** - Source code
- **src/test/java/** - JUnit test files
- **target/** - Maven build output (JAR files, test reports)
- **projects/** - Legacy code and specialized tools
  - **PracticalXML/** - Standalone XML interface implementation
  - **Topos/** - Category theory implementation (Categories, Functors)
  - **run/** - Java application for running code from URLs
  - **macrojsp/** - Universal JSP macro system
  - **systemJsp/** - Remote deployment JSP for JBoss

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

The project uses Maven for building and dependency management.

### Maven Commands
```bash
# Compile the code
mvn compile

# Run all tests (763 tests)
mvn test

# Run specific test
mvn test -Dtest=TestFiles#testFind

# Build JAR files (main, sources, javadoc)
mvn package

# Clean and full rebuild
mvn clean install

# Skip tests during build
mvn package -DskipTests
```

### Test Structure
- Tests extend `Fixtures` base class which provides OS detection (`isWindows`, `isMac`, `isLinux`)
- Use `makePath()` helper for platform-independent path construction
- Test classes follow naming convention: `Test<ClassName>.java` (e.g., TestStrings, TestFiles, TestObjects)
- All 763 tests pass on macOS, Windows, and Linux

### Build Artifacts
Maven generates artifacts in `target/`:
- `myjavatools-6.0.jar` - Compiled library (Java 8)
- `myjavatools-6.0-sources.jar` - Source code archive
- `myjavatools-6.0-javadoc.jar` - Javadoc
- `surefire-reports/` - Test results

## Compatibility

The project is built with Java 8 (source/target 1.8), providing broad compatibility while supporting modern Java features including generics and enhanced for-each loops.

## Architecture Notes

### XmlData Design Philosophy
The XML interface uses unidirectional hierarchy - children have no knowledge of parent containers. This differs from DOM and simplifies handling by avoiding parent references.

### Foundation Package Design
Provides functional programming patterns:
- Functions as first-class values via Function interface
- Map-to-function and function-to-map conversions
- Composition of functions
- Iterable/Iterator enhancements with functional operations
- Uses generics for type safety

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