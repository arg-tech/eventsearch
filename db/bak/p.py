#! /usr/bin/python

import json
import sys
from pprint import pprint
import re
import MySQLdb

for json_file in sys.argv[1:]:
    json_data=open(json_file)
    data = json.load(json_data)
    json_data.close()

    atext = re.sub('<[^<]+?>', '', data['analysis']['txt'].encode('utf-8','ignore'))
    atext = atext.replace('\n', ' ')
    atext = atext.replace('&nbsp;', ' ')
    atext = atext.replace('  ', ' ')
    atext = MySQLdb.escape_string(atext)
    

    print "INSERT INTO text (nodeSetID, text) VALUES ({0}, '{1}');".format(json_file,atext)
