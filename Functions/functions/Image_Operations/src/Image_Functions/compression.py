import base64
import io
from PIL import Image

async def image_compression(image_base64, compression_level="medium", output_format="JPEG"):
    # Define compression quality levels
    quality_levels = {
        "low": 30,    # High compression, lower quality
        "medium": 60, # Moderate compression, balanced quality
        "high": 85    # Low compression, high quality
    }

    # Decode the base64 string to binary image data
    image_data = base64.b64decode(image_base64)

    # Open the image and convert it to RGB mode if necessary
    image = Image.open(io.BytesIO(image_data))
    
    # Ensure the image is in RGB mode for formats like PNG or GIF that might not support compression
    if image.mode != "RGB":
        image = image.convert("RGB")

    # Get compression quality based on the provided level
    quality = quality_levels.get(compression_level, 60)

    # Compress image to desired quality
    output_io = io.BytesIO()
    image.save(output_io, format=output_format, quality=quality)

    compressed_image_data = output_io.getvalue()

    # Encode the compressed image to base64
    compressed_image_base64 = base64.b64encode(compressed_image_data).decode('utf-8')

    # Return the base64 encoded compressed image
    return compressed_image_base64
