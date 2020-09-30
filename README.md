# EventSearch

This runs as a stripped down version of argsearch and works purely as a user interface seperately from the underlying knowledge repository. 

In a local version two main parts will need to be changed in the code to ensure the search functionality still works. 

The URL specified here: action="http://www.aifdb.org/search" id="textsearch" within index.php will need to point to a local install of AIFdb which contains hypothesis data.
  
The URL specified here: $url = "http://tomcat.arg.tech/ArgStructSearch/search/hevy/exec/"; in sendJSON.php will also need to point at a local install of the event AO database. 
