from flask import Flask,request
import ndvi, airQuality
import tileIndex
import json

app = Flask(__name__)

@app.route('/')
def getStartCity():
	return '{"cityName":"Berlin"}'

@app.route('/query')
def performQuery():
	eastFrom = (float) (request.args.get('eastFrom'))
	eastTo = (float) (request.args.get('eastTo'))
	northFrom = (float) (request.args.get('northFrom'))
	northTo = (float) (request.args.get('northTo'))
	res = (int) (request.args.get('res')) # resolution in sqm

	# boundingBox = [490000, 493000, 5874000, 5878000]
	boundingBox = [eastFrom, eastTo, northFrom, northTo]
	n1 = ndvi.NDVI(boundingBox, "2018-05-25", res)
	tileIndexArray = n1.process()
	no2 = airQuality.AirQuality(boundingBox, "2018-05-25", res, tileIndexArray)
	tileIndexArray = no2.process()
	#test =[item.__dict__ for item in tileIndexArray]
	itemList = [item.__str__() for item in tileIndexArray.values()]
	seperator = ", "
	itemList =  seperator.join(itemList)
	ret = '{"type":"FeatureCollection","features":['+ itemList + ']}'
	return ret


if __name__ == '__main__':
	app.run()