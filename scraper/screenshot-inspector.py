from os import listdir
from os.path import isfile, join

mypath = 'screenshots/'
ids = []
onlyfiles = [f for f in listdir(mypath) if isfile(join(mypath, f))]
for file in onlyfiles:
    if file.split('_')[0] != '.DS':
        id = int(file.split('_')[0])
        if id <= 500:
            ids.append(id)
print(ids)



