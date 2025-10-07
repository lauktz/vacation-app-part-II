import sqlite3

class Vacation:

    @staticmethod
    def get_db_connection():
        return sqlite3.connect('my_vacations_db.db')

    @staticmethod
    def create_table():
        with Vacation.get_db_connection() as connection:
            cursor = connection.cursor()
            sql = '''
                CREATE TABLE IF NOT EXISTS vacations (
                    vacation_id INTEGER PRIMARY KEY AUTOINCREMENT,
                    country_id INTEGER NOT NULL,
                    destination TEXT DEFAULT '',
                    description TEXT NOT NULL,
                    start_date TEXT NOT NULL,
                    end_date TEXT NOT NULL,
                    price REAL NOT NULL,
                    image_filename TEXT NOT NULL,
                    FOREIGN KEY (country_id) REFERENCES countries(country_id) ON DELETE CASCADE
                )
            '''
            cursor.execute(sql)
            # Ensure destination column exists for legacy DBs
            try:
                cursor.execute("ALTER TABLE vacations ADD COLUMN destination TEXT DEFAULT ''")
            except Exception:
                pass

    @staticmethod
    def add_vacation(country_id, destination, description, start_date, end_date, price, image_filename):
        with Vacation.get_db_connection() as connection:
            cursor = connection.cursor()
            sql = '''
                INSERT INTO vacations (country_id, destination, description, start_date, end_date, price, image_filename)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            '''
            cursor.execute(sql, (country_id, destination, description, start_date, end_date, price, image_filename))
            connection.commit()
            return {'message': 'Vacation added successfully.'}

    @staticmethod
    def get_all():
        with Vacation.get_db_connection() as connection:
            cursor = connection.cursor()
            # Add destination to the select and mapping
            sql = 'SELECT vacation_id, country_id, destination, description, start_date, end_date, price, image_filename FROM vacations ORDER BY start_date ASC'
            try:
                cursor.execute(sql)
            except sqlite3.OperationalError:
                # fallback for old schema without destination
                sql = 'SELECT vacation_id, country_id, description, start_date, end_date, price, image_filename FROM vacations ORDER BY start_date ASC'
                cursor.execute(sql)
                rows = cursor.fetchall()
                vacations = []
                for row in rows:
                    vacations.append({
                        'vacation_id': row[0],
                        'country_id': row[1],
                        'destination': '',
                        'description': row[2],
                        'start_date': row[3],
                        'end_date': row[4],
                        'price': row[5],
                        'image_filename': row[6]
                    })
                return vacations
            rows = cursor.fetchall()
            vacations = []
            for row in rows:
                vacations.append({
                    'vacation_id': row[0],
                    'country_id': row[1],
                    'destination': row[2],
                    'description': row[3],
                    'start_date': row[4],
                    'end_date': row[5],
                    'price': row[6],
                    'image_filename': row[7]
                })
            return vacations
    @staticmethod
    def get_vacation_by_id(vacation_id):
        with Vacation.get_db_connection() as connection:
            cursor = connection.cursor()
            sql = '''
            SELECT 
            vacation_id, 
            description, 
            start_date, 
            end_date, 
            price, 
            image_filename, 
            country_id 
            FROM vacations WHERE vacation_id = ?
            '''
            cursor.execute(sql, (vacation_id,))
            row = cursor.fetchone()
            cursor.close()
            if row:
                return {
                    'vacation_id': row[0],
                    'description': row[1],
                    'start_date': row[2],
                    'end_date': row[3],
                    'price': row[4],
                    'image_filename': row[5],
                    'country_id': row[6]
                }
            return None

    @staticmethod
    def update_vacation(vacation_id, country_id, destination, description, start_date, end_date, price, image_filename):
        with Vacation.get_db_connection() as connection:
            cursor = connection.cursor()
            sql = '''
                UPDATE vacations
                SET country_id = ?, destination = ?, description = ?, start_date = ?, end_date = ?, price = ?, image_filename = ?
                WHERE vacation_id = ?
            '''
            cursor.execute(sql, (country_id, destination, description, start_date, end_date, price, image_filename, vacation_id))
            connection.commit()
            return {'message': 'Vacation updated successfully.'}

    @staticmethod
    def delete_vacation(vacation_id):
        with Vacation.get_db_connection() as connection:
            cursor = connection.cursor()
            sql = 'DELETE FROM vacations WHERE vacation_id = ?'
            cursor.execute(sql, (vacation_id,))
            connection.commit()
            return {'message': 'Vacation deleted successfully.'}
