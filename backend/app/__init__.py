# app/__init__.py
from flask import Flask
from flask_cors import CORS
from .api import api_bp # Import the blueprint

def create_app(config_class):
    """
    Application factory function.
    """
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Initialize CORS to allow requests from your React frontend
    # Update 'http://localhost:3000' to your React app's URL
    CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}})

    """Change here for 5174 as they are running on port 5174"""

    # Register the blueprint
    # All routes defined in the blueprint will be prefixed with /api
    app.register_blueprint(api_bp, url_prefix='/api')

    return app