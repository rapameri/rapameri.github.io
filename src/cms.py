# -*- coding: utf-8 -*-

import glob
import re

htmlfiles = glob.glob('./_src_*.html')
for file in htmlfiles:
  if re.search(r'_template_\.html$|dmp_.*\.html$',file):
    htmlgiles = htmlfiles.remove(file)
templatefile = open('./_template_.html','r',encoding='utf-8')
templatehtml = re.sub(r'@@false@@\s*?{{.+?}}','',templatefile.read(),flags=re.DOTALL)

for file in htmlfiles:
  filebody = open(file,'r',encoding='utf-8').read()
  filename = re.sub(r'^[\.\\\\/]+|_src_|\.html$','',file)
  html = templatehtml.replace('@@filename@@',filename)
  html = re.sub('@@'+filename+'\.html@@\s*{{(.+?)}}',r'\1',html,flags=re.DOTALL)
  html = re.sub('@@.+?@@\s*?{{.+?}}','',html,flags=re.DOTALL)

  iter = re.finditer(r'@@{{(.+?)}}',html)
  for match in iter:
    id = re.search('<(\w+).* id="'+match.group(1)+'">',filebody)
    if not id:
      continue
    body = re.search(id.group(0)+'(.*?)</'+id.group(1)+'>',filebody,flags=re.DOTALL)
    if not body:
      continue
    html = re.sub(match.group(0),body.group(1),html)

  html = re.sub(r'\n+','\n',html)

  f = open('../'+filename+'.html','w',encoding='utf-8')
  f.write(html)
  f.close()

input('completed.')
