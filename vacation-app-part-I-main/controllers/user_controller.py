import re
import jwt
from datetime import datetime, timedelta
from flask import jsonify, request
from werkzeug.security import generate_password_hash, check_password_hash
from models.user_model import User

class UserController:

    @staticmethod
    def create_jwt_token(user_data):
        """Create JWT token for user"""
        try:
            # Get secret key from environment or use default
            secret_key = 'your_super_secret_key_here_change_in_production_12345'
            
            # Token payload
            payload = {
                'user_id': user_data['user_id'],
                'email': user_data['email'],
                'role_id': user_data['role_id'],
                'exp': datetime.utcnow() + timedelta(hours=1),  # 1 hour expiration
                'iat': datetime.utcnow()
            }
            
            # Create token
            token = jwt.encode(payload, secret_key, algorithm='HS256')
            return token
        except Exception as e:
            print(f"Error creating JWT token: {e}")
            return None

    @staticmethod
    def verify_jwt_token(token):
        """Verify JWT token and return payload"""
        try:
            secret_key = 'your_super_secret_key_here_change_in_production_12345'
            payload = jwt.decode(token, secret_key, algorithms=['HS256'])
            return payload
        except jwt.ExpiredSignatureError:
            return None  # Token expired
        except jwt.InvalidTokenError:
            return None  # Invalid token
        except Exception as e:
            print(f"Error verifying JWT token: {e}")
            return None

    @staticmethod
    def register_user(data):
        required_fields = ['first_name', 'last_name', 'email', 'password']
        if not all(field in data for field in required_fields):
            return jsonify({'error': 'Missing required fields'}), 400

        first_name = data['first_name']
        last_name = data['last_name']
        email = data['email']
        password = data['password']
        role_id = 2  # Force regular user

        # Check for empty fields
        if not all([first_name.strip(), last_name.strip(), email.strip(), password.strip()]):
            return jsonify({'error': 'All fields are required'}), 400

        # Validate email format
        email_pattern = r'^[\w\.-]+@[\w\.-]+\.\w+$'
        if not re.match(email_pattern, email):
            return jsonify({'error': 'Invalid email format'}), 400

        existing_user = User.get_user_by_email(email)
        if existing_user:
            return jsonify({'error': 'Email already exists'}), 409

        # Hash the password before saving (use pbkdf2 to avoid hashlib.scrypt dependency)
        hashed_password = generate_password_hash(password, method='pbkdf2:sha256')

        try:
            new_user = User.create_user(first_name, last_name, email, hashed_password, role_id)
            # Don't return the hashed password in response
            return jsonify({
                'user_id': new_user['user_id'],
                'first_name': new_user['first_name'],
                'last_name': new_user['last_name'],
                'email': new_user['email'],
                'role_id': new_user['role_id']
            }), 201
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    @staticmethod
    def login_user(data):
        if not all(k in data for k in ('email', 'password')):
            return jsonify({'error': 'Missing email or password'}), 400

        email = data['email']
        password = data['password']

        if not email.strip() or not password.strip():
            return jsonify({'error': 'Email and password are required'}), 400

        user = User.get_user_by_email(email)
        if not user:
            return jsonify({'error': 'User not found'}), 404

        # Check password using werkzeug's check_password_hash
        if not check_password_hash(user['password'], password):
            return jsonify({'error': 'Incorrect password'}), 401

        # Create JWT token for the logged-in user
        token = UserController.create_jwt_token(user)
        if token:
            return jsonify({
                'user_id': user['user_id'],
                'first_name': user['first_name'],
                'last_name': user['last_name'],
                'email': user['email'],
                'role_id': user['role_id'],
                'token': token
            }), 201
        else:
            return jsonify({'error': 'Failed to create JWT token'}), 500


    @staticmethod
    def get_all_users():
        try:
            users = User.get_all_users()
            return jsonify(users), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    @staticmethod
    def get_user_by_id(user_id):
        try:
            user = User.get_user_by_id(user_id)
            if user:
                return jsonify(user), 200
            return jsonify({'error': 'User not found'}), 404
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    @staticmethod
    def update_user(user_id):
        try:
            data = request.get_json()
            first_name = data.get('first_name')
            last_name = data.get('last_name')
            email = data.get('email')
            password = data.get('password')
            role_id = data.get('role_id')

            if not all([first_name, last_name, email, password, role_id]):
                return jsonify({'error': 'All fields are required.'}), 400

            email_pattern = r'^[\w\.-]+@[\w\.-]+\.\w+$'
            if not re.match(email_pattern, email):
                return jsonify({'error': 'Invalid email format'}), 400

            # Hash the password before updating (use pbkdf2)
            hashed_password = generate_password_hash(password, method='pbkdf2:sha256')

            result = User.update_user(user_id, first_name, last_name, email, hashed_password, role_id)
            return jsonify(result), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    @staticmethod
    def delete_user(user_id):
        try:
            result = User.delete_user(user_id)
            return jsonify(result), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500
