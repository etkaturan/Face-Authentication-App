# backend/routes/face_recognition.py
import os
from flask import Blueprint, request, jsonify
import face_recognition
import numpy as np
from PIL import Image

# Define a blueprint for face recognition
face_recognition_bp = Blueprint("face_recognition", __name__)

# Path to store uploaded images
UPLOAD_FOLDER = os.path.join(os.getcwd(), "uploads")
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

@face_recognition_bp.route("/test", methods=["POST"])
def test_face():
    if "image" not in request.files:
        return jsonify({"error": "No image provided"}), 400

    image_file = request.files["image"]
    filename = image_file.filename

    try:
        # Save the uploaded image
        file_path = os.path.join(UPLOAD_FOLDER, filename)
        image_file.save(file_path)

        # Process the image
        image = Image.open(file_path)
        image_np = np.array(image)

        # Detect faces
        face_locations = face_recognition.face_locations(image_np)
        if not face_locations:
            return jsonify({"message": "No face detected"})

        # Encode faces
        face_encodings = face_recognition.face_encodings(image_np, face_locations)

        return jsonify({
            "message": "Face(s) detected and image saved",
            "file_path": file_path,
            "face_count": len(face_encodings),
            "face_encodings": [encoding.tolist() for encoding in face_encodings]
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500
# backend/routes/face_recognition.py
@face_recognition_bp.route("/test-saved-image", methods=["GET"])
def test_saved_image():
    # Path to the image you want to test
    file_path = os.path.join(UPLOAD_FOLDER, "etka.jpeg")

    try:
        # Load the image
        image = Image.open(file_path)
        image_np = np.array(image)

        # Detect faces
        face_locations = face_recognition.face_locations(image_np)
        if not face_locations:
            return jsonify({"message": "No face detected in the image"})

        # Encode faces
        face_encodings = face_recognition.face_encodings(image_np, face_locations)

        return jsonify({
            "message": "Face(s) detected in the saved image",
            "face_count": len(face_encodings),
            "face_encodings": [encoding.tolist() for encoding in face_encodings]
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500
