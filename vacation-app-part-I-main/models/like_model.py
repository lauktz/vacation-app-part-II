import sqlite3

class Like:
    @staticmethod
    def get_db_connection():
        return sqlite3.connect('my_vacations_db.db')

    @staticmethod
    def create_table():
        with Like.get_db_connection() as connection:
            cursor = connection.cursor()
            sql = '''
                CREATE TABLE IF NOT EXISTS likes (
                    user_id INTEGER,
                    vacation_id INTEGER,
                    PRIMARY KEY (user_id, vacation_id),
                    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
                    FOREIGN KEY (vacation_id) REFERENCES vacations(vacation_id) ON DELETE CASCADE
                )
            '''
            cursor.execute(sql)
            cursor.close()

    @staticmethod
    def add_like(user_id, vacation_id):
        with Like.get_db_connection() as connection:
            cursor = connection.cursor()
            sql = 'INSERT OR IGNORE INTO likes (user_id, vacation_id) VALUES (?, ?)'
            cursor.execute(sql, (user_id, vacation_id))
            connection.commit()
            cursor.close()
            return {'message': 'Like added'}

    @staticmethod
    def remove_like(user_id, vacation_id):
        with Like.get_db_connection() as connection:
            cursor = connection.cursor()
            sql = 'DELETE FROM likes WHERE user_id = ? AND vacation_id = ?'
            cursor.execute(sql, (user_id, vacation_id))
            connection.commit()
            cursor.close()
            return {'message': 'Like removed'}

    @staticmethod
    def get_likes_by_user(user_id):
        with Like.get_db_connection() as connection:
            cursor = connection.cursor()
            sql = 'SELECT vacation_id FROM likes WHERE user_id = ?'
            cursor.execute(sql, (user_id,))
            likes = cursor.fetchall()
            cursor.close()
            return [vacation_id[0] for vacation_id in likes]

    @staticmethod
    def get_likes_count_for_vacations():
        with Like.get_db_connection() as connection:
            cursor = connection.cursor()
            sql = 'SELECT vacation_id, COUNT(user_id) as like_count FROM likes GROUP BY vacation_id'
            cursor.execute(sql)
            rows = cursor.fetchall()
            cursor.close()
            return {vacation_id: like_count for vacation_id, like_count in rows}
