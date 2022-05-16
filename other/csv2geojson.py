import csv, json
from geojson import Feature, FeatureCollection, Point


ids = [239, 321, 333, 123, 278, 310, 343, 439, 395, 246, 170, 94, 26, 291, 317, 294, 238, 327, 420, 350, 74, 82, 27, 35, 326, 414, 101, 150, 496, 331, 330, 113, 173, 147, 19, 65, 96, 480, 434, 309, 444, 296, 274, 380, 89, 142, 363, 361, 406, 322, 126, 262, 236, 446, 497, 50, 305, 335, 481, 114, 25, 494, 351, 69, 80, 396, 49, 99, 418, 178, 490, 332, 452, 145, 415, 269, 124, 245, 175, 90, 313, 18, 419, 244, 372, 473, 477, 68, 79, 230, 107, 270, 125, 334, 303, 16, 22, 15, 445, 24, 499, 402, 21, 500, 176, 106, 235, 234, 387, 371, 382, 421, 17, 441, 416, 492, 77, 28, 272, 165, 242, 476, 323, 240, 440, 431, 297, 347, 223, 20, 475, 135, 407, 93, 108, 293, 339, 412, 46, 340, 243]
features = []
linecount = 0
longIndex = 0
latIndex = 0
nameIndex = 0
idIndex = 0
codRegIndex = 0
with open('PobladosChile.csv') as csvfile:
    reader = csv.reader(csvfile, delimiter=',')
    for row in reader:
        if linecount == 0:
            latIndex = row.index('point_latitude')
            longIndex = row.index('point_longitude')
            nameIndex = row.index('NOMBRE')
            idIndex = row.index('ID')
            codRegIndex = row.index('COD_REG')
            linecount += 1
        else:
            if int(row[idIndex]) in ids and row[codRegIndex] == '01':
                latitude, longitude = map(float, (row[latIndex], row[longIndex]))
                features.append(
                    Feature(
                        geometry = Point((longitude, latitude)),
                        properties = {
                            'id': row[idIndex],
                            'name': row[nameIndex]
                        }
                    )
                )
                linecount += 1

collection = FeatureCollection(features)
with open("pobladoschile-aricaiqq-500.json", "w") as f:
    f.write('%s' % collection)