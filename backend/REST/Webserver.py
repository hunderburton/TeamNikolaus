from flask import Flask,request

app = Flask(__name__)

@app.route('/')
def getStartCity():
	return '{"cityName":"Berlin"}'

@app.route('/query')
def performQuery():
	eastFrom = request.args.get('eastFrom')
	eastTo = request.args.get('eastTo')
	northFrom = request.args.get('northFrom')
	northTo = request.args.get('northTo')
	res = request.args.get('res') # resolution in sqm
	return '{"TBD"}'


if __name__ == '__main__':
	app.run()