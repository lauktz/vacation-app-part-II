import sqlite3

class Role:
    @staticmethod
    def get_db_connection():
        return sqlite3.connect('my_vacations_db.db')
    
    @staticmethod
    def create_table():
        with Role.get_db_connection() as connection:
            cursor = connection.cursor()
            sql = '''
                CREATE TABLE IF NOT EXISTS roles (
                role_id INTEGER PRIMARY KEY AUTOINCREMENT,
                role_description TEXT NOT NULL
                )
                '''
            cursor.execute(sql)
            cursor.close()

    @staticmethod
    def insert_default_roles():
        with Role.get_db_connection() as connection:
            cursor = connection.cursor()
            sql = 'INSERT INTO roles (role_description) VALUES (?)'
            roles = ['Admin', 'User']
            for role in roles:
                cursor.execute('SELECT * FROM roles WHERE role_description = ?', (role,))
                if cursor.fetchone() is None:
                    cursor.execute(sql, (role,))
            connection.commit()
            cursor.close()