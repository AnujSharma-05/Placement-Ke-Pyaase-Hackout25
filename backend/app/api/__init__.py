# app/api/__init__.py
from flask import Blueprint

# Create a Blueprint object
api_bp = Blueprint('api', __name__)

# Import the routes to register them with the blueprint
from . import routes