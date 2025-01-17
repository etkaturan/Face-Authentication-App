from flask import Blueprint, request, jsonify
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm.exc import NoResultFound
from database.db_config import SessionLocal, User
import face_recognition
import numpy as np
import cv2
import base64
import dlib
from imutils import face_utils

# Blueprint and database session setup
auth_bp = Blueprint("auth", __name__)
db = SessionLocal()

# Utility: Preprocess the image
def preprocess_image(image):
    """Normalize lighting and crop the face."""
    face_locations = face_recognition.face_locations(image)
    if not face_locations:
        raise ValueError("No face detected")
    
    # Crop the first detected face
    top, right, bottom, left = face_locations[0]
    face_image = image[top:bottom, left:right]

    # Normalize lighting
    gray = cv2.cvtColor(face_image, cv2.COLOR_BGR2GRAY)
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    equalized = clahe.apply(gray)
    return cv2.cvtColor(equalized, cv2.COLOR_GRAY2BGR)

# Utility: Check liveness using video frames
def check_liveness(frames):
    """Analyze video frames to verify motion and prevent spoofing."""
    motions = []
    prev_frame = None

    for frame in frames:
        frame_data = np.frombuffer(base64.b64decode(frame.split(",")[1]), np.uint8)
        img = cv2.imdecode(frame_data, cv2.IMREAD_COLOR)

        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        gray = cv2.GaussianBlur(gray, (5, 5), 0)

        if prev_frame is not None:
            diff = cv2.absdiff(prev_frame, gray)
            _, thresh = cv2.threshold(diff, 25, 255, cv2.THRESH_BINARY)
            motion = np.sum(thresh) > 0
            motions.append(motion)

        prev_frame = gray

    return any(motions)

# Route: Register a new user
@auth_bp.route("/register", methods=["POST"])
def register_user():
    try:
        if "name" not in request.form or "email" not in request.form or "image" not in request.form:
            return jsonify({"error": "Name, email, and image are required"}), 400

        name = request.form["name"]
        email = request.form["email"]
        image_data = request.form["image"]

        frame_data = np.frombuffer(base64.b64decode(image_data.split(",")[1]), np.uint8)
        img = cv2.imdecode(frame_data, cv2.IMREAD_COLOR)

        processed_img = preprocess_image(img)

        face_encodings = face_recognition.face_encodings(processed_img)
        if not face_encodings:
            return jsonify({"error": "No face detected"}), 400

        face_encoding = face_encodings[0]

        new_user = User(name=name, email=email, face_encoding=np.array(face_encoding).tobytes())
        db.add(new_user)
        db.commit()

        return jsonify({"message": "User registered successfully"}), 201

    except IntegrityError:
        db.rollback()
        return jsonify({"error": "Email already registered"}), 400

    except Exception as e:
        print("Error during registration:", str(e))
        return jsonify({"error": str(e)}), 500

# Route: Recognize user
@auth_bp.route("/recognize", methods=["POST"])
def recognize_user():
    try:
        if "image" not in request.json:
            return jsonify({"error": "Image is required"}), 400

        image_data = request.json["image"]
        frame_data = np.frombuffer(base64.b64decode(image_data.split(",")[1]), np.uint8)
        img = cv2.imdecode(frame_data, cv2.IMREAD_COLOR)

        processed_img = preprocess_image(img)

        face_encodings = face_recognition.face_encodings(processed_img)
        if not face_encodings:
            return jsonify({"error": "No face detected"}), 400

        login_encoding = face_encodings[0]

        users = db.query(User).all()
        scores = []
        for user in users:
            registered_encoding = np.frombuffer(user.face_encoding, dtype=np.float64)
            distance = face_recognition.face_distance([registered_encoding], login_encoding)[0]
            similarity_score = (1 - distance) * 100
            scores.append((user, similarity_score))

        scores.sort(key=lambda x: x[1], reverse=True)

        top_matches = scores[:3]
        response_data = [
            {
                "name": match[0].name,
                "email": match[0].email,
                "similarity_score": f"{match[1]:.2f}"
            }
            for match in top_matches
        ]

        return jsonify({"success": True, "matches": response_data}), 200

    except Exception as e:
        print("Error during recognition:", str(e))
        return jsonify({"error": str(e)}), 500
