# backend/app.py
from flask import Flask
from routes.face_recognition import face_recognition_bp

# backend/app.py
from routes.auth import auth_bp

app = Flask(__name__)

# Register blueprints
app.register_blueprint(face_recognition_bp, url_prefix="/api/face")
app.register_blueprint(auth_bp, url_prefix="/api/auth")

if __name__ == "__main__":
    app.run(debug=True)
