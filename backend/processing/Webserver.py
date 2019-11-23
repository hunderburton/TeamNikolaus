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
    tileIndexArray = {}
    n1 = ndvi.NDVI(boundingBox, "2018-05-25", res, tileIndexArray)
    tileIndexArray = n1.process()
    print("Num Results NDVI: " + str(len(tileIndexArray)))
    no2 = airQuality.AirQuality(boundingBox, "2018-05-25", res, tileIndexArray)
    #tileIndexArray = no2.process()
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

# http://127.0.0.1:5000/query?lonFrom=8.6512&lonTo=8.7512&latFrom=49.8728&latTo=49.9728&res=100
# http://127.0.0.1:5000/query_ch?lonFrom=8.6512&lonTo=8.7512&latFrom=49.8728&latTo=49.9728&res=100&chan=ndvi,air,temp
#"properties": {"index": "0.2069140625"}, "geometry": { "type":"Point", "coordinates": [8.652998561151078, 49.973399520383694, 0.0]}}
# [ndvi,air,temp]
@app.route('/query_ch')
def performQueryChannel():
    eastFrom = (float) (request.args.get('lonFrom'))
    eastTo = (float) (request.args.get('lonTo'))
    northFrom = (float) (request.args.get('latFrom'))
    northTo = (float) (request.args.get('latTo'))
    res = (int) (request.args.get('res')) # resolution in sqm

    tileIndexArray = {}
    # boundingBox = [490000, 493000, 5874000, 5878000]
    boundingBox = [eastFrom, eastTo, northFrom, northTo]

    # Get processing channels that are needed for this request
    predefChannels = ["ndvi", "air", "temp"]
    chanStr = request.args.get('chan')  # "ndvi,air,temp"
    chanList = []
    if chanStr:
        chanList = chanStr.split(",")

    # Process just specified channels
    if chanList: # has items
        for chan in chanList:
            print(chan)
            if chan == "ndvi":
                alg1Ndvi = ndvi.NDVI(boundingBox, "2018-05-25", res)
                tileIndexArray = alg1Ndvi.process()
            elif chan == "air":
                alg2Air = airQuality.AirQuality(boundingBox, "2018-05-25", res, tileIndexArray)
                tileIndexArray = alg2Air.process()
            #elif chan == "temp":
                # todo

    # Process everything:
    else:
        alg1Ndvi = ndvi.NDVI(boundingBox, "2018-05-25", res)
        tileIndexArray = alg1Ndvi.process()
        alg2Air = airQuality.AirQuality(boundingBox, "2018-05-25", res, tileIndexArray)
        tileIndexArray = alg2Air.process()


    #test =[item.__dict__ for item in tileIndexArray]
    itemList = [item.__str__() for item in tileIndexArray.values()]
    seperator = ", "
    itemList =  seperator.join(itemList)
    response = make_response('{"type":"FeatureCollection","features":[' + itemList + ']}')
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['content-type'] = 'application/json'
    return response


if __name__ == '__main__':
    app.run()
