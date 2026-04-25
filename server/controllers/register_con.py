from flask import jsonify
from server.database.database import get_db_connection


def register_for_lesson(user_id, lesson_id):
    try:
        if not isinstance(user_id, int) or not isinstance(lesson_id, int):
            return {'status': 'error', 'message': 'User ID and Lesson ID must be integers'}
        
        with get_db_connection() as connection:
            with connection.cursor() as cursor:
                # Start transaction
                cursor.execute("SET TRANSACTION ISOLATION LEVEL REPEATABLE READ")
                cursor.execute("SELECT COUNT(*) FROM Users WHERE UserID = %s", (user_id,))
                user_count = cursor.fetchone()[0]
                if user_count == 0:
                    connection.rollback()
                    return {'status': 'error', 'message': 'Invalid User ID'}
                
                cursor.execute("""
                    SELECT 
                        COUNT(T.UserID) AS RegisteredUsers, 
                        L.MaxStudent 
                    FROM Lessons L
                    LEFT JOIN Take T ON L.LessonID = T.LessonID
                    WHERE L.LessonID = %s
                    GROUP BY L.LessonID, L.MaxStudent
                    FOR UPDATE;
                """, (lesson_id,))
                result = cursor.fetchone()
                if not result:
                    connection.rollback()
                    return {'status': 'error', 'message': 'Lesson not found'}

                registered_users, max_students = result
                if registered_users >= max_students:
                    connection.rollback()
                    return {'status': 'error', 'message': 'Lesson is full. Registration failed.'}
                
                print(f"Preparing to fetch update data for LessonID: {lesson_id}")
                cursor.execute(
                    "INSERT INTO Take (UserID, LessonID) VALUES (%s, %s);",
                    (user_id, lesson_id)
                )

                # Commit transaction
                connection.commit()
                return {'status': 'success', 'message': 'Registration successful'}
    except Exception as e:
        if 'connection' in locals():
            connection.rollback()
        return {'status': 'error', 'message': str(e)}

def cancel_registration(user_id, lesson_id):
    try:
        if not isinstance(user_id, int) or not isinstance(lesson_id, int):
            return {'status': 'error', 'message': 'User ID and Lesson ID must be integers'}

        with get_db_connection() as connection:
            with connection.cursor() as cursor:
                cursor.execute("SET TRANSACTION ISOLATION LEVEL REPEATABLE READ")
                cursor.execute(
                    "SELECT COUNT(*) FROM Take WHERE UserID = %s AND LessonID = %s;",
                    (user_id, lesson_id)
                )
                is_registered = cursor.fetchone()[0]
                if is_registered == 0:
                    connection.rollback()
                    return {'status': 'error', 'message': 'User is not registered for this lesson'}
                cursor.execute(
                    """
                    UPDATE Lessons
                    LEFT JOIN (SELECT LessonID, COUNT(UserID) AS RegisteredUsers FROM Take GROUP BY LessonID) AS T
                    ON Lessons.LessonID = T.LessonID
                    SET Lessons.MaxStudent = Lessons.MaxStudent
                    WHERE Lessons.LessonID = %s;
                    """,
                    (lesson_id,)
                )
                cursor.execute(
                    "DELETE FROM Take WHERE UserID = %s AND LessonID = %s;",
                    (user_id, lesson_id)
                )
                connection.commit()
                return {'status': 'success', 'message': 'Cancellation successful'}
    except Exception as e:
        if 'connection' in locals():
            connection.rollback()
        return {'status': 'error', 'message': str(e)}

                
def get_takes_by_user_id(user_id):
    try:
        with get_db_connection() as connection:
            with connection.cursor(dictionary=True) as cursor:
                query = "SELECT * FROM Take WHERE UserID = %s"
                cursor.execute(query, (user_id,))
                takes = cursor.fetchall()
                return takes
    except Exception as e:
        raise e