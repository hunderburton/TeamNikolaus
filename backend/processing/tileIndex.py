
class TileIndex:
    def __init__(self, north, east):
        self.vegIndex = -1.0
        self.no2Index = -1.0
        self.north = north
        self.east = east

    def setVegIndex(self, vegIndex):
        self.vegIndex = vegIndex

    def setNo2Index(self, no2Index):
        self.no2Index = no2Index

    def getOverallIndex(self):
        sumIndexes = 0
        numIndexes = 0
        for key in self.__dict__.keys():
            if "Index" in key and self.__dict__[key] != -1:
                sumIndexes = sumIndexes + self.__dict__[key]
                numIndexes = numIndexes + 1
        self.overallIndex = sumIndexes / numIndexes
        return self.overallIndex

    def __str__(self):
        return '''{{"type":"Feature", "properties": {{"index": "{overallIndex}"}}, "geometry": {{ "type":"Point", "coordinates": [{east}, {north}, 0.0]}}}}'''.format(east = self.east, north = self.north, overallIndex = self.getOverallIndex())