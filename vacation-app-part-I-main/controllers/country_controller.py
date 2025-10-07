from flask import jsonify, request
from models.country_model import Country

class CountryController:

    @staticmethod
    def get_all_countries():
        try:
            countries = Country.get_all_countries()
            return jsonify(countries), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    @staticmethod
    def add_country():
        try:
            data = request.get_json()
            if not data or 'country_name' not in data:
                return jsonify({'error': 'Country name is required'}), 400
            
            country_name = data['country_name'].strip()
            if not country_name:
                return jsonify({'error': 'Country name cannot be empty'}), 400
            
            country = Country.add_country(country_name)
            return jsonify(country), 201
        except ValueError as e:
            return jsonify({'error': str(e)}), 409
        except Exception as e:
            return jsonify({'error': str(e)}), 500
