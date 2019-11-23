import overpy


def query_amenities(lat_from, lon_from, lat_to, lon_to, amenities):
    api = overpy.Overpass()
    query = 'node({0}, {1}, {2}, {3})["amenity"="{4}"];out;'.format(lat_from, lon_from, lat_to, lon_to, amenities)
    return api.query(query)
