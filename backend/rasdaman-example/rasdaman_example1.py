# Get a subset coverage by slicing on time axis, trimming on spatial axes, and encoding result in image/jpeg.

from PIL import Image
import requests
from io import BytesIO

# Set base url which can be used in further code examples
service_endpoint = "https://processing.code-de.org/rasdaman/ows"
base_wcs_url = service_endpoint + "?service=WCS&version=2.0.1"

request = "&REQUEST=GetCoverage"
cov_id = "&COVERAGEID=S2G5_32632_TCI_L1C"
subset_time = "&SUBSET=ansi(\"2018-05-25\")"
subset_e = "&SUBSET=E(410827.774058,418495.854389)"
subset_n = "&SUBSET=N(5957107.75272,5960032.77898)"
encode_format = "&FORMAT=image/jpeg"

response = requests.get(base_wcs_url + request + cov_id + subset_time + subset_e + subset_n + encode_format)

# Display result directly
data = response.content
fh = open("test.jpg", 'wb')
fh.write(data)
fh.close()
img = Image.open(BytesIO(data))

img.show()
