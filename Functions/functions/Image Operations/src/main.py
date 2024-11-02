from appwrite.client import Client
from appwrite.services.databases import Databases
from appwrite.services.storage import Storage
from appwrite.exception import AppwriteException
from .Image_Functions.Enhancement import process_image_operations
import os

# Assuming process_image_operations function is already defined elsewhere
# from your_module import process_image_operations

def main(context):
    
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
    file_id = context.req.payload["$id"]
    image_database = os.environ["IMAGE_DATABASE_ID"]
    image_operation_collection = os.environ["IMAGE_OPERATION_COLLECTION_ID"]

    try:
        # Fetch the document from the 'image_operation' collection using the file_id
        document = database.get_document(image_database,image_operation_collection, file_id)
        
        # Log the retrieved document
        context.log(f"Image operation document for {file_id}: {document}")

        # Update progress state to 'processing'
        database.update_document(image_database,image_operation_collection, file_id, {"progress_state": "processing"})
        
        # Extract operations and file path
        operations = document.get("operations", {})
        file_path = document.get("file_path")  # Assuming file_path is stored in the document

        # Call the process_image_operations function
        output_image_url = process_image_operations(file_path, operations)
        
        # Update original image in the bucket        

        # Log the output image URL
        context.log(f"Processed image URL: {output_image_url}")

        # Update progress state to 'completed'
        database.update_document(image_database,image_operation_collection, file_id, {
            "progress_state": "completed",
            "output_image_url": output_image_url
        })
        
        return context.res.json({"output_image_url": output_image_url}, 200)
      
    except AppwriteException as err:
        context.error("Could not retrieve document: " + repr(err))
        return context.res.json({"error": "Could not retrieve document"}, 500)

    
