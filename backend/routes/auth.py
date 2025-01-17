# backend/routes/auth.py
from flask import Blueprint, request, jsonify
from sqlalchemy.exc import IntegrityError
from database.db_config import SessionLocal, User
import face_recognition
import numpy as np
from PIL import Image
import io
import os
# Define a blueprint for authentication
auth_bp = Blueprint("auth", __name__)
db = SessionLocal()

@auth_bp.route("/register", methods=["POST"])
def register_user():
    # Default values for testing
    name = request.form.get("name", "Default User")
    email = request.form.get("email", "default@example.com")
    file_path = os.path.join("uploads", "etka.jpeg")

    if not os.path.exists(file_path):
        return jsonify({"error": "Default image not found"}), 400

    try:
        # Process the image and generate face encoding
        with open(file_path, "rb") as image_file:
            image = Image.open(image_file)
            image_np = np.array(image)

            face_locations = face_recognition.face_locations(image_np)
            if not face_locations:
                return jsonify({"error": "No face detected in the image"}), 400

            face_encodings = face_recognition.face_encodings(image_np, face_locations)
            if len(face_encodings) > 1:
                return jsonify({"error": "Multiple faces detected. Please use an image with a single face"}), 400

            face_encoding = face_encodings[0]

            # Save the user to the database
            new_user = User(name=name, email=email, face_encoding=np.array(face_encoding).tobytes())
            db.add(new_user)
            db.commit()

            return jsonify({"message": f"User '{name}' registered successfully"}), 201

    except Exception as e:
        db.rollback()
        return jsonify({"error": str(e)}), 500

@auth_bp.route("/login", methods=["POST"])
def login_user():
    # Path to the testing image
    file_path = os.path.join("uploads", "etka.jpeg")

    if not os.path.exists(file_path):
        return jsonify({"error": "Test image not found"}), 400

    try:
        # Process the test image
        with open(file_path, "rb") as image_file:
            image = Image.open(image_file)
            image_np = np.array(image)

            face_locations = face_recognition.face_locations(image_np)
            if not face_locations:
                return jsonify({"error": "No face detected in the image"}), 400

            face_encodings = face_recognition.face_encodings(image_np, face_locations)
            if len(face_encodings) > 1:
                return jsonify({"error": "Multiple faces detected. Please use an image with a single face"}), 400

            login_encoding = face_encodings[0]

            # Compare with stored face encodings in the database
            users = db.query(User).all()
            for user in users:
                stored_encoding = np.frombuffer(user.face_encoding, dtype=np.float64)
                match = face_recognition.compare_faces([stored_encoding], login_encoding, tolerance=0.6)

                if match[0]:
                    return jsonify({
                        "message": f"Login successful for user '{user.name}'",
                        "email": user.email
                    }), 200

            return jsonify({"error": "No matching user found"}), 401

    except Exception as e:
        return jsonify({"error": str(e)}), 500
