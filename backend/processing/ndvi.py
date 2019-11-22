import requests
from PIL import Image
import numpy as np
from tileIndex import TileIndex
from io import BytesIO


class NDVI:
    def __init__(self, boundingBox, date, res = 100):
        self.boundingBox = boundingBox
        self.date = date
        self.tilesize = (int) (res / 10)
        print(self.tilesize)
        self.service_endpoint = "https://processing.code-de.org/rasdaman/ows"
        self.base_wcs_url = self.service_endpoint + "?service=WCS&version=2.0.1"
        self.requestTemplate =     '''
        for $c in (S2G5_32632_10m_L1C)
        return
          encode(
            scale(
              (((float) $c.B8 - $c.B4) / ((float) $c.B8 + $c.B4))
              [ ansi( "{date}" ), E( {eastStart} : {eastEnd} ), N( {northStart} : {northEnd} ) ]
              > 0.5,
              {{ E:"CRS:1"(0:700) }}
            )
          , "image/jpeg")
        '''
        self.requestTemplate = self.requestTemplate.format(date = date, eastStart = boundingBox[0], eastEnd = boundingBox[1], northStart = boundingBox[2], northEnd = boundingBox[3])


    def process(self):
        response = requests.post(self.service_endpoint, data={'query': self.requestTemplate})
        data = response.content
        filename = "ndvi{date}.jpg".format(date = self.date)
        fh = open(filename, 'wb')
        fh.write(data)
        fh.close()
        img = Image.open(BytesIO(data))
        arr = np.array(img)
        print(np.average(arr) / 256)
        w, h = img.size
        results = []
        for i in range(0,h,self.tilesize):
            for j in range(0,w,self.tilesize):
                box = (j, i, j + self.tilesize, i + self.tilesize)
                tile = img.crop(box)
                east = (j + (self.tilesize / 2)) * (self.boundingBox[1] - self.boundingBox[0]) / w + self.boundingBox[0]
                north = (i + (self.tilesize / 2)) * (self.boundingBox[3] - self.boundingBox[2]) / h + self.boundingBox[3]
                index = TileIndex(self.calcProperties(tile), north, east)
                print(index)
                results.append(index)

        # todo: 1d image, living plant -> white, calc index
    def calcProperties(self, image):
        arr = np.array(image)
        vegetationpercent = np.average(arr) / 256
        return vegetationpercent

