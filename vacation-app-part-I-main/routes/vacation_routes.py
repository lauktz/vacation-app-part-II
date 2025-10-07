from flask import Blueprint
from controllers.vacation_controller import VacationController
from auth_decorator import require_auth, require_admin

vacation_bp = Blueprint('vacations', __name__)

@vacation_bp.route('/vacations', methods=['POST'])
@require_auth  # Requires authentication to create vacation
def create_vacation():
    return VacationController.create_vacation()

@vacation_bp.route('/vacations', methods=['GET'])
#@require_auth  # Requires authentication to get vacation
def get_vacations():  # Public route - no authentication required
    return VacationController.get_vacations()

@vacation_bp.route('/vacations/<int:vacation_id>', methods=['PUT'])
@require_auth  # Requires authentication to update vacation
def update_vacation(vacation_id):
    return VacationController.update_vacation(vacation_id)

@vacation_bp.route('/vacations/<int:vacation_id>', methods=['DELETE'])
@require_admin  # Requires admin role to delete vacation
def delete_vacation(vacation_id):
    return VacationController.delete_vacation(vacation_id)

@vacation_bp.route('/vacations/<int:vacation_id>', methods=['GET'])
def get_vacation_by_id(vacation_id):  # Public route - no authentication required
    return VacationController.get_vacation_by_id(vacation_id)
