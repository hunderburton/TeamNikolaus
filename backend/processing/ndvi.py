import requests
from PIL import Image
import numpy as np
from tileIndex import TileIndex
from io import BytesIO


class NDVI:
    def __init__(self, boundingBox, date, res = 100, itemList = {}):
        self.boundingBox = boundingBox
        self.date = date
        self.itemList = itemList
        self.spatialResolution = 10
        print(res)
        self.tilesize = (int) (res / self.spatialResolution)
        self.service_endpoint = "https://processing.code-de.org/rasdaman/ows"
        self.base_wcs_url = self.service_endpoint + "?service=WCS&version=2.0.1"
        self.requestTemplateNDVI =     '''
        for $b4 in (Germany_2D_B04_10m), $b8 in (Germany_2D_B08_10m)
        return encode(
            (((float) $b8 - $b4) / ((float) $b8 + $b4))
            [ Lon(  {eastStart} :  {eastEnd} ), Lat(  {northStart} : {northEnd} ) ]
                      > 0.5,
                      "image/jpeg")
        '''
        self.requestTemplateNDVI = self.requestTemplateNDVI.format(date = date, eastStart = boundingBox[0], eastEnd = boundingBox[1], northStart = boundingBox[2], northEnd = boundingBox[3])


    def process(self):
        response = requests.post(self.service_endpoint, data={'query': self.requestTemplateNDVI})
        data = response.content
        filename = "ndvi{date}.jpg".format(date = self.date)
        fh = open(filename, 'wb')
        fh.write(data)
        fh.close()
        img = Image.open(BytesIO(data))
        arr = np.array(img)
        # print(np.average(arr) / 256)
        w, h = img.size
        for i in range(0,h,self.tilesize):
            for j in range(0,w,self.tilesize):
                box = (j, i, j + self.tilesize, i + self.tilesize)
                tile = img.crop(box)
                east = (j + (self.tilesize / 2)) * (self.boundingBox[1] - self.boundingBox[0]) / w + self.boundingBox[0]
                north = self.boundingBox[3] - (i + (self.tilesize / 2)) * (self.boundingBox[3] - self.boundingBox[2]) / h

                key = str(east) + "." + str(north)
                if(key not in self.itemList.keys()):
                    self.itemList[key] = TileIndex(north, east)
                self.itemList[key].setVegIndex(self.calcVegIndex(tile))
        return self.itemList

        # todo: 1d image, living plant -> white, calc index
    def calcVegIndex(self, image):
        arr = np.array(image)
        vegetationpercent = np.average(arr) / 256
        return vegetationpercent

