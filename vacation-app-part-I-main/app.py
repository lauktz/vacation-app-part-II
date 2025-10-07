from flask import Flask
from flask import send_from_directory
from flask import request, jsonify
from werkzeug.utils import secure_filename
import os
from flask_cors import CORS
from models.role_model import Role
from models.user_model import User
from routes.user_routes import auth_bp
from models.country_model import Country
from models.vacation_model import Vacation
from routes.vacation_routes import vacation_bp
from models.like_model import Like
from routes.like_routes import like_bp
from routes.countries_route import country_bp




# from routes.role_routes import role_bp 
app = Flask(__name__)
CORS(app)

# app.register_blueprint(role_bp)

# create database and table  
Role.create_table()
User.create_table()
#load the default roles admin and user
Role.insert_default_roles()
print("Roles table created and initialized with Admin and User roles")

Country.create_table()
Vacation.create_table()
# Country.insert_default_countries() moved to seed_data.py
print("Countries table created")
print("Vacations table created.")
Like.create_table()
print("Likes table created.")




app.register_blueprint(auth_bp)
app.register_blueprint(vacation_bp)
app.register_blueprint(like_bp)
app.register_blueprint(country_bp)

@app.route("/")
def root():
    return {"status": "ok", "msg": "Flask API running", "port": 5003}, 200

# Serve images from the images directory
@app.route('/images/<path:filename>')
def serve_image(filename):
    base_dir = os.path.dirname(os.path.abspath(__file__))
    images_dir = os.path.join(base_dir, 'images')
    return send_from_directory(images_dir, filename)

# Image upload endpoint (requires auth handled in routes or simple token check here)
@app.route('/upload-image', methods=['POST'])
def upload_image():
    # Optional: simple bearer token presence check to align with protected actions
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return jsonify({'error': 'Authorization header missing or invalid'}), 401

    if 'file' not in request.files:
        return jsonify({'error': 'No file part in the request'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    filename = secure_filename(file.filename)
    base_dir = os.path.dirname(os.path.abspath(__file__))
    images_dir = os.path.join(base_dir, 'images')
    os.makedirs(images_dir, exist_ok=True)

    save_path = os.path.join(images_dir, filename)
    file.save(save_path)

    return jsonify({
        'filename': filename,
        'url': f"/images/{filename}"
    }), 200

print("URL MAP:", app.url_map)
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5003)

