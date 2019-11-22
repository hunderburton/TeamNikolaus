
class TileIndex:
    def __init__(self, vegIndex, north, east):
        self.vegIndex = vegIndex
        self.north = north
        self.east = east

    def __str__(self):
        return str(self.east) + ":" + str(self.north) + ":" + str(self.vegIndex)