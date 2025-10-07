
import sqlite3

class User:
    @staticmethod
    def get_db_connection():
        return sqlite3.connect('my_vacations_db.db')

    @staticmethod
    def create_table():
        with User.get_db_connection() as connection:
            cursor = connection.cursor()
            sql = '''
                CREATE TABLE IF NOT EXISTS users (
                user_id INTEGER PRIMARY KEY AUTOINCREMENT,
                first_name TEXT NOT NULL,
                last_name TEXT NOT NULL,
                email TEXT NOT NULL,
                password TEXT NOT NULL,
                role_id INTEGER NOT NULL,
                FOREIGN KEY (role_id) REFERENCES roles(role_id) ON DELETE CASCADE
                )
            '''
            cursor.execute(sql)
            cursor.close()

    @staticmethod
    def create_user(first_name, last_name, email, password, role_id):
        with User.get_db_connection() as connection:
            cursor = connection.cursor()
            sql = '''
                INSERT INTO users (first_name, last_name, email, password, role_id)
                VALUES (?, ?, ?, ?, ?)
            '''
            cursor.execute(sql, (first_name, last_name, email, password, role_id))
            user_id = cursor.lastrowid
            connection.commit()
            cursor.close()
            return {
                'user_id': user_id,
                'first_name': first_name,
                'last_name': last_name,
                'email': email,
                'password': password,
                'role_id': role_id
            }

    @staticmethod
    def get_all_users():
        with User.get_db_connection() as connection:
            cursor = connection.cursor()
            sql = 'SELECT * FROM users'
            cursor.execute(sql)
            users = cursor.fetchall()
            cursor.close()
            return [
                {
                    'user_id': u[0],
                    'first_name': u[1],
                    'last_name': u[2],
                    'email': u[3],
                    'role_id': u[5]
                } for u in users
            ]

    @staticmethod
    def get_user_by_id(user_id):
        with User.get_db_connection() as connection:
            cursor = connection.cursor()
            sql = 'SELECT * FROM users WHERE user_id = ?'
            cursor.execute(sql, (user_id,))
            user = cursor.fetchone()
            cursor.close()
            if user:
                return {
                    'user_id': user[0],
                    'first_name': user[1],
                    'last_name': user[2],
                    'email': user[3],
                    'role_id': user[5]
                }
            return None

    @staticmethod
    def get_user_by_email(email):
        with User.get_db_connection() as connection:
            cursor = connection.cursor()
            cursor.execute("SELECT * FROM users WHERE email = ?", (email,))
            user = cursor.fetchone()
            cursor.close()
            if user:
                return {
                    'user_id': user[0],
                    'first_name': user[1],
                    'last_name': user[2],
                    'email': user[3],
                    'password': user[4],
                    'role_id': user[5]
                }
            return None

    @staticmethod
    def delete_user(user_id):
        with User.get_db_connection() as connection:
            cursor = connection.cursor()
            cursor.execute('DELETE FROM users WHERE user_id = ?', (user_id,))
            connection.commit()
            cursor.close()
            return {'message': 'User deleted successfully'}
        
    @staticmethod
    def update_user(user_id, first_name, last_name, email, password, role_id):
        with User.get_db_connection() as connection:
            cursor = connection.cursor()
            cursor.execute('''
                UPDATE users
                SET first_name = ?, last_name = ?, email = ?, password = ?, role_id = ?
                WHERE user_id = ?
            ''', (first_name, last_name, email, password, role_id, user_id))
            connection.commit()
            cursor.close()
            return {'message': 'User updated successfully'}