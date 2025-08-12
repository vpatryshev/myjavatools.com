# Myjavatools.com

<font color="red">THIS FILE IS WORK IN PROGRESS</font>

Hello friends,

This is myjavatools project, where I published various general purpose Java Tools, for everyone to use.  
[Here is the license for the code published here.](license.txt)  
I've been using these tools for years. Your input is always appreciated.  
Compatibility: Versions of this library are compatible with appropriate versions of JDK: 1.3.1 up to 6.0.  
This forum: **[www.livejournal.com/community/myjavatools](http://www.livejournal.com/community/myjavatools)** is dedicated to myjavatools news and discussions.  
[java.net Member Button](http://www.java.net)

## What we currently have here:

- [lib](projects/v.6.0/lib/doc/index.html) ([ver.6.0](projects/v.6.0/lib/mjlib60.zip), [ver.5.0](projects/v.5.0/lib/mjlib50.zip), [ver.1.4.2](projects/v.1.4.2/lib/mjlib142.zip), [ver.1.3.1](projects/v.1.3.1/lib/mjlib131.zip)) - a set of useful tools that I've been developing for the last several years:
    - [Foundation package](http:projects/v.6.0/lib/doc/index.html) (list of function values on a list, make a function from a map, define a map from a function and a collection, grepping lists and iterables, compound iterator, index of an element in an array...) - and [an article](http:projects/v.6.0/foundations.html)
    - [Objects](http:projects/v.5.0/lib/doc/com/myjavatools/lib/foundation/Objects.html) (converts arrays and lists to maps, like in Perl, composition of two maps, inverse, calculates crc32 on your data, index of an element in an array...)
    - [Strings](http:projects/v.6.0/lib/doc/com/myjavatools/lib/Strings.html) (like in Perl split, like in Perl join, replace a substring, zips a string to a string, fill, countChar, first differing position, greps an array of CharSequences, decode, for(char c : chars("abcdef")) {}...)
    - [Files](http:projects/v.6.0/lib/doc/com/myjavatools/lib/Files.html) (finds a file in a tree, changes current directory, calculates relative path, writes data to a file, copies files or directories, deleteFile, compare, synchronizes two directories, for(byte b : bytes(new FileInputStream("filename.ext"))) {}, for(char b : chars(new File("filename.ext"))) {}, for(String b : lines(new File("filename.ext"))) {}, for(File file : files(new File("."))) {}, for(File folder : tree(new File(".")))...) and [an article](http://www.devx.com/Java/Article/27367)
    - [FormattedWriter](http:projects/v.1.4.2/lib/doc/com/myjavatools/lib/FormattedWriter.html) (uses MessageFormat for creative output)
    - [Web](http:projects/v.1.4.2/lib/doc/com/myjavatools/lib/Web.html) (downloadFile, getHtmlCharset, sendMail...)
    - [Tools](http:projects/v.1.4.2/lib/doc/com/myjavatools/lib/Tools.html) (bark, inform, fatalError, runCommand...)
    - [ZipInput](http:projects/v.1.4.2/lib/doc/com/myjavatools/lib/ZipInput.html) (gets input from various sources and retrieves the contents)
- [web](http://www.devx.com/Java/Article/17679/0) ([ver 6.0](projects/v.6.0/web/mjweb.zip), [ver 1.4.2](projects/v.1.4.2/web/mjweb.zip)) - two classes for sending multipart POST requests from Java and receiving them in servlet/jsp
- [run](projects/run) - a Java application that runs code from a URL (ver. 1.2, with '-override' and '-newer' flags)
- [jsp ver.1.4.2](projects/v.1.4.2/jsp22) [](http://www.myjavatools.com/projects/v.1.3.1/jsp22) - Universal JSP turns JSP language into Macro
- Practical XML - [article](http://www.devx.com/Java/Article/16571/0), ver. 5.0 ([docs](projects/v.5.0/xml/doc/index.html), [download](projects/v.5.0/xml/mjxml.zip)), ver. 1.4.2 ([docs](projects/v.1.4.2/xml/doc/index.html), [download](projects/v.1.4.2/xml/mjxml.zip)), ver. 1.3.1 ([docs](projects/v.1.3.1/xml/doc/index.html), [download](projects/v.1.3.1/xml/mjxml.zip))
- [RSS](projects/v.1.4.2/xml/doc/com/myjavatools/xml/Rss.html) - see [my article](http://www.devx.com/Java/Article/21415/0) - included in Xml package (see above)
- [download.jsp](projects/download/download.jsp)
- [remote deployment JSP for JBoss](projects/systemJsp/readme.html)
- Cheat sheets: [Design Patterns](cuecards/designpatterns.html), [Refactoring](cuecards/refactoring.html), [Java Trivia](cuecards/javatrivia.html)
- [Crash Course in Monads](http://www.patryshev.com/monad/m-intro.html)
- [Categories for programmers Part I](http://www.patryshev.com/cat/doc/EasyCategoriesForProgrammers.pdf) *new!*

[this site's RSS](index.xml)  
