import io
import base64
import numpy as np
import tensorflow as tf
from PIL import Image as PILImage
import cv2
import os

TFLITE_MODEL_PATH = os.path.join(os.path.dirname(__file__), "efficientdet_lite0.tflite")

# Load the TensorFlow Lite model
interpreter = tf.lite.Interpreter(model_path=TFLITE_MODEL_PATH)
interpreter.allocate_tensors()

# Get input and output details
input_details = interpreter.get_input_details()
output_details = interpreter.get_output_details()

def object_detection(image_base64: str, image_format: str, confidence_threshold: float = 0.5):
    # Decode base64 to get the image
    image_data = base64.b64decode(image_base64)
    image = PILImage.open(io.BytesIO(image_data)).convert("RGB")
    original_format = image_format if image_format else 'PNG'  # Use the passed format or fallback to PNG

    # Resize and quantize the image
    image_np = np.array(image)
    image_np = cv2.resize(image_np, (320, 320))  # Resize to model input size
    image_np = image_np.astype(np.uint8)  # Ensure uint8 type
    image_np = np.expand_dims(image_np, axis=0)  # Add batch dimension

    # Set the input tensor with quantized input
    interpreter.set_tensor(input_details[0]['index'], image_np)

    # Run inference
    interpreter.invoke()

    # Get the output tensors
    boxes = interpreter.get_tensor(output_details[0]['index'])[0]  # Bounding boxes
    classes = interpreter.get_tensor(output_details[1]['index'])[0]  # Class IDs
    scores = interpreter.get_tensor(output_details[2]['index'])[0]  # Confidence scores
    num_detections = int(interpreter.get_tensor(output_details[3]['index'])[0])  # Valid detections count

    # Draw bounding boxes on the original image (OpenCV format)
    output_image = np.array(image)
    output_image = cv2.cvtColor(output_image, cv2.COLOR_RGB2BGR)

    for i in range(num_detections):
        if scores[i] >= confidence_threshold:
            # Bounding box coordinates are normalized, scale them
            ymin, xmin, ymax, xmax = boxes[i]
            (left, top, right, bottom) = (int(xmin * image.width), int(ymin * image.height),
                                          int(xmax * image.width), int(ymax * image.height))

            # Draw the bounding box
            cv2.rectangle(output_image, (left, top), (right, bottom), (0, 255, 0), 2)
            label = f"Class {int(classes[i])}: {scores[i]:.2f}"
            cv2.putText(output_image, label, (left, top - 10),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)

    # Convert back to RGB and save in original format
    output_image_rgb = cv2.cvtColor(output_image, cv2.COLOR_BGR2RGB)
    output_image_pil = PILImage.fromarray(output_image_rgb)

    # Encode output image as base64
    buffered = io.BytesIO()
    output_image_pil.save(buffered, format=original_format)  # Use the detected or fallback format
    encoded_image = base64.b64encode(buffered.getvalue()).decode("utf-8")

    return encoded_image
