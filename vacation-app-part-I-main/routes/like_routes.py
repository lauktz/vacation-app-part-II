from flask import Blueprint, request
from controllers.like_controller import LikeController
from auth_decorator import require_auth

like_bp = Blueprint('likes', __name__)

@like_bp.route('/likes', methods=['POST'])
@require_auth  # Requires authentication to add like
def add_like():
    data = request.get_json()
    return LikeController.add_like(data)

@like_bp.route('/likes', methods=['DELETE'])
@require_auth  # Requires authentication to remove like
def remove_like():
    data = request.get_json()
    return LikeController.remove_like(data)

@like_bp.route('/likes/<int:user_id>', methods=['GET'])
def get_likes_by_user(user_id):  # Public route - no authentication required
    return LikeController.get_likes_by_user(user_id)

@like_bp.route('/likes/counts', methods=['GET'])
def get_likes_count_for_vacations():
    return LikeController.get_likes_count_for_vacations()