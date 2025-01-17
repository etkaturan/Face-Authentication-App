from flask import Flask
from flask_cors import CORS
from routes.auth import auth_bp

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes
CORS(auth_bp)

# Register blueprints
app.register_blueprint(auth_bp, url_prefix="/api/auth")

if __name__ == "__main__":
    app.run(debug=True)


