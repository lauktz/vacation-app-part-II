from flask import jsonify, request
from models.vacation_model import Vacation
from datetime import datetime


class VacationController:

    @staticmethod
    def create_vacation():
        try:
            data = request.get_json()
            country_id = data.get('country_id')
            description = data.get('description')
            start_date = data.get('start_date')
            end_date = data.get('end_date')
            price = data.get('price')
            image_filename = data.get('image_filename')

            if not all([country_id, description, start_date, end_date, price, image_filename]):
                return jsonify({'error': 'All fields are required.'}), 400
            #price validation
            try:
                price = float(price)
            except ValueError:
                return jsonify({'error': 'Price must be a number.'}), 400

            if price < 0 or price > 10000:
                return jsonify({'error': 'Price must be between 0 and 10,000.'}), 400
            
            # Validate date format and check for past dates
            
            try:
                start_dt = datetime.strptime(start_date, "%Y-%m-%d")
                if start_dt.date() < datetime.today().date():
                    return jsonify({'error': 'Start date cannot be in the past'}), 400
            except ValueError:
                return jsonify({'error': 'Invalid date format. Use YYYY-MM-DD'}), 400
            
            # Validate that end_date is after or same as start_date
            try:
                end_dt = datetime.strptime(end_date, "%Y-%m-%d")
                if end_dt.date() < start_dt.date():
                    return jsonify({'error': 'End date cannot be earlier than start date'}), 400
            except ValueError:
                return jsonify({'error': 'Invalid end date format. Use YYYY-MM-DD'}), 400


            destination = data.get('destination', '')
            result = Vacation.add_vacation(country_id, destination, description, start_date, end_date, price, image_filename)
            return jsonify(result), 200

        except Exception as e:
            return jsonify({'error': str(e)}), 500

    @staticmethod
    def get_vacations():
        try:
            result = Vacation.get_all()
            return jsonify(result), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    @staticmethod
    def update_vacation(vacation_id):
        try:
            data = request.get_json()
            country_id = data.get('country_id')
            description = data.get('description')
            start_date = data.get('start_date')
            end_date = data.get('end_date')
            price = data.get('price')
            image_filename = data.get('image_filename', '')

            if not all([country_id, description, start_date, end_date, price]):
                return jsonify({'error': 'All fields except image_filename are required.'}), 400

            # Validate price
            try:
                price = float(price)
            except ValueError:
                return jsonify({'error': 'Price must be a number.'}), 400

            if price < 0 or price > 10000:
                return jsonify({'error': 'Price must be between 0 and 10,000.'}), 400

            # Validate dates format and logic
            from datetime import datetime
            try:
                start_dt = datetime.strptime(start_date, "%Y-%m-%d")
                end_dt = datetime.strptime(end_date, "%Y-%m-%d")
                if end_dt.date() < start_dt.date():
                    return jsonify({'error': 'End date cannot be earlier than start date'}), 400
            except ValueError:
                return jsonify({'error': 'Invalid date format. Use YYYY-MM-DD'}), 400

            destination = data.get('destination', '')
            result = Vacation.update_vacation(vacation_id, country_id, destination, description, start_date, end_date, price, image_filename)
            return jsonify(result), 200 if 'error' not in result else 400

        except Exception as e:
            return jsonify({'error': str(e)}), 500

    @staticmethod
    def delete_vacation(vacation_id):
        try:
            result = Vacation.delete_vacation(vacation_id)
            return jsonify(result), 200 if 'error' not in result else 400
        except Exception as e:
            return jsonify({'error': str(e)}), 500
        

    @staticmethod
    def get_vacation_by_id(vacation_id):
        try:
            vacation = Vacation.get_vacation_by_id(vacation_id)
            if vacation:
                return jsonify(vacation), 200
            else:
                return jsonify({'error': 'Vacation not found'}), 404
        except Exception as e:
            return jsonify({'error': str(e)}), 500 
