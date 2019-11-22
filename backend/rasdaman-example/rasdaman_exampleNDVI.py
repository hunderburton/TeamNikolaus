# Get a subset coverage by slicing on time axis, trimming on spatial axes, and encoding result in image/jpeg.

from PIL import Image
import requests
from io import BytesIO

# Set base url which can be used in further code examples
service_endpoint = "https://processing.code-de.org/rasdaman/ows"
base_wcs_url = service_endpoint + "?service=WCS&version=2.0.1"

query1 = '''
for $c in (S2G5_32632_10m_L1C) 
return
  encode(
    scale(
      {
         red: $c.B8[ ansi( "2018-05-25" ), E( 484000 : 493000 ), N( 5874000 : 5878000 ) ] / 17.0;
         green: $c.B4[ ansi( "2018-05-25" ), E( 484000 : 493000 ), N( 5874000 : 5878000 ) ] / 17.0;
         blue: $c.B3[ ansi( "2018-05-25" ), E( 484000 : 493000 ), N( 5874000 : 5878000 ) ] / 17.0
      },
      { E:"CRS:1"(0:700) }
    ) 
  , "image/jpeg")
'''

query2 = '''
for $c in (S2G5_32632_10m_L1C) 
return
  encode(
    scale(
      {
         red: $c.B8[ ansi( "2018-05-25" ), E( 484000 : 493000 ), N( 5874000 : 5878000 ) ] / 17.0;
         green: $c.B4[ ansi( "2018-05-25" ), E( 484000 : 493000 ), N( 5874000 : 5878000 ) ] / 17.0;
         blue: $c.B3[ ansi( "2018-05-25" ), E( 484000 : 493000 ), N( 5874000 : 5878000 ) ] / 17.0
      },
      { E:"CRS:1"(0:700) }
    ) 
  , "image/jpeg")
'''

response = requests.post(service_endpoint, data={'query': query2})

# Display result directly
data = response.content
fh = open("test.jpg", 'wb')
fh.write(data)
fh.close()
img = Image.open(BytesIO(data))
img.show()
