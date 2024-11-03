import io
import os
import appwrite
import numpy as np
import matplotlib.pyplot as plt
from PIL import Image as PILImage
import cv2
from datetime import datetime
from ultralytics import YOLO
from appwrite.services.storage import Storage


def object_detection(file_response, client , storage : Storage ):

    model = YOLO("yolov8m.pt")
    # Initialize Appwrite storage
    storage = storage(client)
    
    # Open image and convert it
    image = PILImage.open(io.BytesIO(file_response))
    image = np.array(image)
    image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

    # Run YOLO model on the image
    results = model(image)
    output_image = image_rgb.copy()
    detected_objects = {}
    object_frames = {}

    for result in results:
        boxes = result.boxes
        for box in boxes:
            x1, y1, x2, y2 = map(int, box.xyxy[0].cpu().numpy())
            confidence = float(box.conf[0])
            class_id = int(box.cls[0])
            class_name = model.names[class_id]
            
            if confidence > 0.5:
                # Draw bounding box and label on image
                cv2.rectangle(output_image, (x1, y1), (x2, y2), (0, 255, 0), 2)
                label = f'{class_name}: {confidence:.2f}'
                cv2.putText(output_image, label, (x1, y1 - 10),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)
                
                # Count and store each detected object
                detected_objects[class_name] = detected_objects.get(class_name, 0) + 1

                # Crop object frame and store
                frame = image_rgb[y1:y2, x1:x2]
                object_frames.setdefault(class_name, []).append((frame, confidence))
    
    # Plot the output image with detections
    plt.figure(figsize=(15, 15))
    plt.imshow(output_image)
    plt.axis('off')
    plt.title('Detected Objects')
    
    # Save plot to a temporary file
    temp_filename = f'detection_{datetime.now().strftime("%Y%m%d_%H%M%S")}.png'
    plt.savefig(temp_filename, format='png')
    
    # Upload to Appwrite bucket
    with open(temp_filename, "rb") as image_file:
        file_response = storage.create_file(
            bucket_id=os.environ["APPWRITE_BUCKET_ID"],
            file_id='unique()',  # Generates unique ID
            file=image_file
        )
    
    # Clean up local temp file
    os.remove(temp_filename)

    # Return Appwrite file URL
    return file_response["$id"]