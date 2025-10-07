from flask import Blueprint
from controllers.country_controller import CountryController

country_bp = Blueprint('countries', __name__)

@country_bp.route('/countries', methods=['GET'])
def get_all_countries():
    return CountryController.get_all_countries()

@country_bp.route('/countries', methods=['POST'])
def add_country():
    return CountryController.add_country()
