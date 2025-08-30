# run.py
from app import create_app
from config import Config

# Create the Flask app instance using the factory function
app = create_app(Config)
if __name__ == '__main__':
    # The host='0.0.0.0' makes the server accessible on your local network
    app.run(host='0.0.0.0', port=5000, debug=True)