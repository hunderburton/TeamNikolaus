import ndvi

boundingBox = [490000, 493000, 5874000, 5878000]

n1 = ndvi.NDVI(boundingBox, "2018-05-25")
n1.process()

