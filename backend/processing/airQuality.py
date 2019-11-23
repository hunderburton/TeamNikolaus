import requests
from PIL import Image
import numpy as np
from tileIndex import TileIndex
from io import BytesIO


class AirQuality:
    def __init__(self, boundingBox, date, res = 100):
        self.boundingBox = boundingBox
        self.date = date

        # Resolution around 7 km
        self.tilesize = (int) (res / 10)
        if res > 7000:
            self.tilesize = (int) (res / 7000)
        else:
            self.tilesize = 1
        self.resolution = res
        print(self.tilesize)

        self.service_endpoint = "https://processing.code-de.org/rasdaman/ows"
        self.base_wcs_url = self.service_endpoint + "?service=WCS&version=2.0.1"

        # Lon( 7.6512 : 16.7512 ), Lat( 45.8728 : 49.9728 )
        self.requestTemplate = '''
        for $c in (No2_Tropo) 
        return encode(
            $c[ Lon(  {eastStart} :  {eastEnd} ), Lat(  {northStart} : {northEnd} ) ] * 2
            , "image/jpeg")
        '''

        #for $b4 in (Germany_2D_B04_10m), $b8 in (Germany_2D_B08_10m)
        #return encode(
        #    (((float) $b8 - $b4) / ((float) $b8 + $b4))
        #    [ Lon(  {eastStart} :  {eastEnd} ), Lat(  {northStart} : {northEnd} ) ]
        #              > 0.5,
        #              "image/jpeg")

        self.requestTemplate = self.requestTemplate.format(date = date, eastStart = boundingBox[0], eastEnd = boundingBox[1], northStart = boundingBox[2], northEnd = boundingBox[3])

    def process(self):
        response = requests.post(self.service_endpoint, data={'query': self.requestTemplate})
        data = response.content
        filename = "air{date}.jpg".format(date = self.date)
        fh = open(filename, 'wb')
        fh.write(data)
        fh.close()
        img = Image.open(BytesIO(data))
        arr = np.array(img)
        # print(np.average(arr) / 256)
        pixelsInWidth, pixelsInHeight = img.size
        results = []
        tilesPerPixel = 7000 / self.resolution

        if self.resolution < 7000:
            for x in range(0, pixelsInWidth, 1):
                for y in range(0, pixelsInHeight, 1):
                    box = (x, y, x + 1, y + 1)
                    pixel = img.crop(box)
                    pixelIndex = self.calcIndex(pixel)
                    numberOfTilesLon = pixelsInWidth * tilesPerPixel
                    numberOfTilesLat = pixelsInHeight * tilesPerPixel
                    widthOfTileLon = (self.boundingBox[1] - self.boundingBox[0]) / numberOfTilesLon
                    heightOfTileLat = (self.boundingBox[3] - self.boundingBox[2]) / numberOfTilesLat
                    for k in range(0, tilesPerPixel, self.resolution):
                        for l in range(0, tilesPerPixel, self.resolution):
                            lon = 0.5 * widthOfTileLon + (x * tilesPerPixel + k) * widthOfTileLon
                            lat = 0.5 * heightOfTileLat + (y * tilesPerPixel + l) * heightOfTileLat
                            index = TileIndex(pixelIndex, lat, lon)
                            # print(index)
                            results.append(index)
        else:
            for x in range(0, pixelsInWidth, self.tilesize):
                for y in range(0, pixelsInHeight, self.tilesize):
                    box = (x, y, x + self.tilesize, y + self.tilesize)
                    tile = img.crop(box)
                    lon = (x + (self.tilesize / 2)) * (self.boundingBox[1] - self.boundingBox[0]) / pixelsInWidth + self.boundingBox[0]
                    lat = (y + (self.tilesize / 2)) * (self.boundingBox[3] - self.boundingBox[2]) / pixelsInHeight + self.boundingBox[3]
                    index = TileIndex(self.calcIndex(tile), lat, lon)
                    # print(index)
                    results.append(index)

        return results

    # todo: 1d image, living plant -> white, calc index
    def calcIndex(self, image):
        arr = np.array(image)
        airQualityIndex = 1 - np.average(arr) / 100
        return airQualityIndex



#https://geoservice.dlr.de/eoc/atmosphere/wcs?subset=E(345621.2663053448, 5436574.527335456)&subset=N(624450.2475419734, 5611049.990445666)&subset=time("2018-05-07T00:00:00Z")&service=WCS&format=image/tiff&
#    request=GetCoverage&version=2.0.1&coverageId=atmosphere__SVELD_S5P_NO2TROPO_P1M

# Correct:
#https://geoservice.dlr.de/eoc/atmosphere/wcs?&subset=E(345621.2663053448,%205436574.527335456)&subset=N(624450.2475419734,%205611049.990445666)&subset=time(%222018-05-07T00:00:00Z%22)&service=WCS&format=image/tiff&request=GetCoverage&version=2.0.1&coverageId=atmosphere__SVELD_S5P_NO2TROPO_P1M

#No2_Tropo

#BBOX=345621.2663053448%2C5436574.527335456%2C624450.2475419734%2C5611049.990445666

#https://geoservice.dlr.de/eoc/basemap/wms?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&FORMAT=image%2Fpng&TRANSPARENT=true&LAYERS=litemap&TILED=&STYLES=&SRS=EPSG%3A25832&FORMAT_OPTIONS=dpi%3A113&WIDTH=1849&HEIGHT=1157&BBOX=345621.2663053448%2C5436574.527335456%2C624450.2475419734%2C5611049.990445666