import os
import aiohttp

async def generate_image_url(image_data: str) -> str:
    # Define the API endpoint and API key
    api_url = os.environ['IMAGE_HOSTING_API_URL']
    api_key = os.environ['IMAGE_HOSTING_API_KEY']
    
    # Define the payload for the POST request
    payload = {
        'key': api_key,
        'action': 'upload',
        'source': image_data,
        'format': 'json'
    }

    # Create an aiohttp session
    async with aiohttp.ClientSession() as session:
        # Send POST request
        async with session.post(api_url, data=payload) as response:
            # Check if the response is successful
            if response.status == 200:
                # Parse the JSON response
                response_data = await response.json()

                # Check if the status is successful
                if response_data.get("status_txt") == "OK" and response_data.get("success"):
                    # Extract the image URL from the response
                    image_url = response_data["image"]["url"]
                    return image_url
                else:
                    raise Exception(f"Error in uploading image: {response_data.get('status_txt')}")
            else:
                raise Exception(f"API request failed with status code {response.status}")

# Example usage:
# image_base64_data = "base64_image_data_here"  # Replace with your actual base64 image string
# image_url = await generate_image_url(image_base64_data)
# print("Image URL:", image_url)
