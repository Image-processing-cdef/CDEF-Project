import json
import os
import asyncio

from appwrite.client import Client
from appwrite.services.databases import Databases
from appwrite.services.storage import Storage
from appwrite.exception import AppwriteException
from .Image_Functions.compression import image_compression
from .Object_Detection.object_det import object_detection
from .utils.image_hosting import generate_image_url
from .utils.image_to_string import convert_image_to_string
from .Image_Functions.Enhancement import process_image_operations


async def main(context):
    payload = context.req.body
    
    client = (
        Client()
        .set_endpoint(os.environ["APPWRITE_FUNCTION_API_ENDPOINT"])
        .set_project(os.environ["APPWRITE_FUNCTION_PROJECT_ID"])
        .set_key(context.req.headers["x-appwrite-key"])
    )

    database = Databases(client)
    storage = Storage(client)

    # Simple health check for the endpoint
    if context.req.path == "/ping":
        return context.res.text("Pong")

    # Retrieve the file ID from the event context
    file_id = payload["$id"]
    image_database = os.environ["IMAGE_DATABASE_ID"]
    projectID = os.environ["APPWRITE_FUNCTION_PROJECT_ID"]
    image_operation_collection = os.environ["IMAGE_OPERATION_COLLECTION_ID"]
    bucketID = os.environ["IMAGE_BUCKET_ID"]

    try:
        # Fetch the document from the 'image_operation' collection using the file_id
        document =  database.get_document(image_database, image_operation_collection, file_id)

        # Log the retrieved document
        context.log(f"Image operation document for {file_id}: {document}")

        # Extract operations and file path
        operations = document.get("operations", {})
        file_path = f"https://cloud.appwrite.io/v1/storage/buckets/{bucketID}/files/{file_id}/view?project={projectID}"
        
        # Call the process_image_operations function
        output_image_url = await process_image_operations(file_path,operations)


        #convert image to base64 string
        if operations['object_detection'] or operations['image_compression'] != "none":
            image_data , image_format = await convert_image_to_string(file_id , bucketID , output_image_url , storage)

        if operations['image_compression'] != "none":
            # Call the image_compression function
            compressed_image = await image_compression(image_data, operations['image_compression'] , image_format)
            compressed_image_url = await generate_image_url(compressed_image)

        image_url = output_image_url if operations['image_compression'] == "none" else compressed_image_url

        if operations['object_detection']:
            image = image_data if operations['image_compression'] == "none" else compressed_image
            object_image = object_detection(image , image_format)
            object_output_url = await generate_image_url(object_image)
        else:
            object_output_url = 'none'
        
        # Update progress state to 'completed'
        database.update_document(
            image_database,
            image_operation_collection,
            file_id,
            {
                "progress_state": "completed",
                "output_image_url": image_url,
                "output_object_url": object_output_url
            }
        )

        context.log(f"Image operations completed successfully for {file_id}")

        return context.res.json(
            {"output_image_url": image_url , "object_output_url" : object_output_url }, 200)

    except AppwriteException as err:
        context.error("Could not retrieve document: " + repr(err))
        return context.res.json({"error": "Could not retrieve document"}, 500)
