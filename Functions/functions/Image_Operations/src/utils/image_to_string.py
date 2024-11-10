import aiohttp
import base64
from appwrite.services.storage import Storage
from PIL import Image as PILImage
import io

async def convert_image_to_string(file_id, bucket_id, image_url, storage: Storage):
    # Fetch and process image based on `image_url` presence
    if image_url != "none":
        # Fetch image from the URL
        async with aiohttp.ClientSession() as session:
            async with session.get(image_url) as response:
                if response.status == 200:
                    image_data = await response.read()
                    # Use PIL to determine the image format
                    image = PILImage.open(io.BytesIO(image_data))
                    image_format = image.format  # Automatically deduce the format
                else:
                    raise Exception("Failed to fetch image from URL")
    else:
        # Fetch image from Appwrite storage
        response = storage.get_file_view(bucket_id, file_id)
        if response.status_code == 200:
            image_data = response.content
            # Use PIL to determine the image format
            image = PILImage.open(io.BytesIO(image_data))
            image_format = image.format  # Automatically deduce the format
        else:
            raise Exception("Failed to fetch image from Appwrite storage")
    
    # Convert binary image data to base64 encoded string
    image_base64 = base64.b64encode(image_data).decode('utf-8')
    
    return image_base64, image_format  # Return the base64 string and image format
