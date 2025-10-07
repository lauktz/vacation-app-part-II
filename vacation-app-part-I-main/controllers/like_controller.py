
from flask import jsonify, request
from models.like_model import Like

class LikeController:

    @staticmethod
    def get_likes_count_for_vacations():
        try:
            counts = Like.get_likes_count_for_vacations()
            return jsonify(counts), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    @staticmethod
    def add_like(data):
        user_id = data.get('user_id')
        vacation_id = data.get('vacation_id')

        if not user_id or not vacation_id:
            return jsonify({'error': 'user_id and vacation_id are required.'}), 400

        # Prevent duplicate likes
        existing_likes = Like.get_likes_by_user(user_id)
        if vacation_id in existing_likes:
            return jsonify({'error': 'Vacation already liked by this user.'}), 409

        try:
            result = Like.add_like(user_id, vacation_id)
            return jsonify(result), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    @staticmethod
    def remove_like(data):
        user_id = data.get('user_id')
        vacation_id = data.get('vacation_id')

        if not user_id or not vacation_id:
            return jsonify({'error': 'user_id and vacation_id are required.'}), 400

        # Check if the like exists
        existing_likes = Like.get_likes_by_user(user_id)
        if vacation_id not in existing_likes:
            return jsonify({'error': 'Like does not exist.'}), 404

        try:
            result = Like.remove_like(user_id, vacation_id)
            return jsonify(result), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    @staticmethod
    def get_likes_by_user(user_id):
        try:
            likes = Like.get_likes_by_user(user_id)
            return jsonify({'user_id': user_id, 'liked_vacations': likes}), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500