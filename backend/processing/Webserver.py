from flask import Flask, request, make_response
import ndvi, airQuality
import tileIndex
import json

app = Flask(__name__)


@app.route('/')
def get_start_city():
    return '{"cityName":"Berlin"}'


@app.route('/query')
def perform_query():
    east_from = float(request.args.get('lonFrom'))
    east_to = float(request.args.get('lonTo'))
    north_from = float(request.args.get('latFrom'))
    north_to = float(request.args.get('latTo'))
    # boundingBox = [490000, 493000, 5874000, 5878000]
    bounding_box = [east_from, east_to, north_from, north_to]

    res = int(request.args.get('res'))  # resolution in sqm
    channels = request.args.get('chan')  # "ndvi,air,temp"

    channel_list = []
    if channels:
        channel_list = channels.split(",")
    # Process just specified channels
    if channel_list:  # has items
        for chan in channel_list:
            print(chan)
            if chan == "ndvi":
                alg1_ndvi = ndvi.NDVI(bounding_box, "2018-05-25", res, {})
                tile_index_array = alg1_ndvi.process()
            elif chan == "air":
                alg2_air = airQuality.AirQuality(bounding_box, "2018-05-25", res, tile_index_array)
                tile_index_array = alg2_air.process()
            # elif chan == "temp":
            # TODO implement
    # Process everything:
    else:
        alg1_ndvi = ndvi.NDVI(bounding_box, "2018-05-25", res, {})
        tile_index_array = alg1_ndvi.process()
        alg2_air = airQuality.AirQuality(bounding_box, "2018-05-25", res, tile_index_array)
        tile_index_array = alg2_air.process()

    items = [item.__str__() for item in tile_index_array.values()]
    separator = ", "
    items = separator.join(items)
    response = make_response('{"type":"FeatureCollection","features":[' + items + ']}')
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['content-type'] = 'application/json'
    return response


if __name__ == '__main__':
    app.run()
