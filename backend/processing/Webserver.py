from flask import Flask, request, make_response
import ndvi, airQuality
import tileIndex
import json


app = Flask(__name__)


@app.route('/')
def getStartCity():
    return '{"cityName":"Berlin"}'


@app.route('/query')
def performQuery():
    eastFrom = (float) (request.args.get('lonFrom'))
    eastTo = (float) (request.args.get('lonTo'))
    northFrom = (float) (request.args.get('latFrom'))
    northTo = (float) (request.args.get('latTo'))
    res = (int) (request.args.get('res')) # resolution in sqm

    # boundingBox = [490000, 493000, 5874000, 5878000]
    boundingBox = [eastFrom, eastTo, northFrom, northTo]
	print("Boundary Box:")
    [print(item) for item in boundingBox]
    n1 = ndvi.NDVI(boundingBox, "2018-05-25", res, {})
    tileIndexArray = n1.process()
    print("Num Results NDVI: " + str(len(tileIndexArray)))
    no2 = airQuality.AirQuality(boundingBox, "2018-05-25", res, tileIndexArray)
    tileIndexArray = no2.process()
    print("Num Results NO2: " + str(len(tileIndexArray)))
    #test =[item.__dict__ for item in tileIndexArray]
    itemList = [item.__str__() for item in tileIndexArray.values()]
    print("Num Results: " + str(len(itemList)))
    seperator = ", "
    itemList =  seperator.join(itemList)
    response = make_response('{"type":"FeatureCollection","features":[' + itemList + ']}')
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['content-type'] = 'application/json'
    return response

if __name__ == '__main__':
    app.run()
