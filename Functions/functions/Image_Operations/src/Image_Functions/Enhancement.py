import os
import aiohttp

async def process_image_operations(image_url, operations) -> str:
    # Default settings to compare with
    default_operations = {
        "restoration": {
            "upscale": 'none',
            "polish": False
        },
        "resizing": {
            "width": "100%",
            "height": "100%",
            "smart_cropping": "none"
        },
        "adjustments": {
            "hdr": 0
        },
        "background_removal": False
    }

    # Check if all operation settings are default
    if operations == default_operations:
        return 'none'
    
    base_url = os.environ["CLAID_API_URL"]
    headers = {"Authorization": f"BEARER {os.environ['CLAID_API_KEY']}"}

    # Get the upscale and polish values from operations
    upscale_value = operations.get("restoration", {}).get("upscale", "none")
    polish_value = operations.get("restoration", {}).get("polish", False)

    # Check if upscale is "none" and polish is True, then set upscale to "smart_enhance"
    if upscale_value == "none" and polish_value:
        upscale_value = "smart_enhance"
    
    # Check if the upscale_value is valid (excluding "none")
    valid_upscale_values = ['smart_enhance', 'smart_resize', 'faces', 'digital_art', 'photo']
    if upscale_value != "none" and upscale_value not in valid_upscale_values:
        raise Exception(f"Invalid upscale value: {upscale_value}. Valid values are: {valid_upscale_values}")

    # Handle resizing and other operations
    width = operations.get("resizing", {}).get("width", "100%")
    height = operations.get("resizing", {}).get("height", "100%")

    if isinstance(width, str) and not width.endswith("%"):
        width = int(width)
    if isinstance(height, str) and not height.endswith("%"):
        height = int(height)

    # Prepare the data payload
    data = {
        "input": image_url,
        "operations": {
            "restorations": {
                "decompress": "auto",
                "polish": polish_value
            },
            "resizing": {
                "width": width,
                "height": height
            }
        }
    }

    # If upscale is not "none", add it to the payload
    if upscale_value != "none":
        data["operations"]["restorations"]["upscale"] = upscale_value

    smart_cropping = operations.get("resizing", {}).get("smart_cropping", "none")
    if smart_cropping != "none":
        data["operations"]["resizing"]["fit"] = {"crop": smart_cropping}

    hdr_value = operations.get("adjustments", {}).get("hdr", 0)
    if hdr_value != 0:
        data["operations"]["adjustments"] = {"hdr": hdr_value}

    if operations.get("background_removal", False):
        data["operations"]["background"] = {"remove": True}

    # Send the request asynchronously
    async with aiohttp.ClientSession() as session:
        async with session.post(base_url, json=data, headers=headers) as response:
            if response.status == 200:
                response_data = await response.json()
                return response_data.get("data", {}).get("output", {}).get("tmp_url")
            else:
                response_text = await response.text()
                raise Exception("Image processing failed:", response_text)
