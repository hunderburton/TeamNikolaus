
class TileIndex:
    def __init__(self, vegIndex, north, east):
        self.vegIndex = vegIndex
        self.north = north
        self.east = east

    def __str__(self):
        return '''{{"type":"Feature", "properties": {{"id":"vegIndex", "index": "{vegIndex}"}}, "geometry": {{ "type":"Point", "coordinates": "[{east}, {north}, 0.0]"}}}}'''.format(east = self.east, north = self.north, vegIndex = self.vegIndex)