import requests

def process_image_operations(image_url, operations):
    base_url = "https://api.claid.ai/v1/operations"
    headers = {"Authorization": "Bearer YOUR_API_KEY"}

    # Initialize the request data
    data = {"image_url": image_url, "operations": {}}

    # Add resizing
    if operations.get("resize"):
        data["operations"]["resizing"] = {
            "width": operations["resize"]["width"],
            "height": operations["resize"]["height"],
            "fit": operations["resize"].get("fit", "crop")
        }

    # Add smart resize
    if operations.get("smart_resize"):
        data["operations"]["smart_resize"] = {
            "width": operations["smart_resize"]["width"],
            "height": operations["smart_resize"]["height"],
            "fit": "bounds"
        }

    # Add smart enhance
    if operations.get("smart_enhance"):
        data["operations"]["smart_enhance"] = True

    # Add digital art enhancement
    if operations.get("digital_art"):
        data["operations"]["digital_art"] = True

    # Add face enhancement
    if operations.get("faces"):
        data["operations"]["faces"] = True

    # Add photo enhancement
    if operations.get("photo"):
        data["operations"]["photo"] = True

    # Add restoration
    if operations.get("restoration"):
        data["operations"]["restoration"] = {"level": operations["restoration"].get("level", "medium")}

    # Add color adjustment
    if operations.get("color_adjustment"):
        data["operations"]["color_adjustment"] = {
            "brightness": operations["color_adjustment"].get("brightness", 1.0),
            "contrast": operations["color_adjustment"].get("contrast", 1.0),
            "saturation": operations["color_adjustment"].get("saturation", 1.0)
        }

    # Add background removal
    if operations.get("background_removal"):
        data["operations"]["background_removal"] = True

    # Make API request
    response = requests.post(base_url, json=data, headers=headers)
    
    if response.status_code == 200:
        return response.json().get("output_image_url", "No URL returned.")
    else:
        raise Exception("Image processing failed:", response.text)
