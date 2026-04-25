from server.database.database import get_db_connection
import mysql.connector

def get_lessons_by_resort_id(resort_id):
    try:
        with get_db_connection() as connection:
            with connection.cursor(dictionary=True) as cursor:
                query = """
                SELECT l.LessonID, l.Level, l.ResortID, l.LessonType, l.EquipmentType, l.Price, l.MaxStudent, COUNT(t.UserID) as RegisteredUsers 
                FROM Lessons l Left JOIN Take t ON l.LessonID = t.LessonID
                WHERE l.ResortID = %s
                GROUP BY l.LessonID
                """
                cursor.execute(query, (resort_id,))
                lessons = cursor.fetchall()
                return lessons
    except mysql.connector.Error as db_err:
        raise db_err

def get_lesson_by_id(lesson_id):
    try:
        connection = get_db_connection()
        cursor = connection.cursor(buffered=True, dictionary=True)

        query = """
            SELECT
                l.LessonID,
                l.ResortID,
                l.Level,
                l.LessonType,
                l.EquipmentType,
                l.Price,
                l.MaxStudent,
                COUNT(t.UserID) AS RegisteredUsers,
                i.InstructorID,
                i.InstructorName,
                i.AverageRating,
                i.Language,
                i.YearsOfExperience,
                r.ResortName
            FROM Lessons l
            LEFT JOIN Teach ON l.LessonID = Teach.LessonID
            LEFT JOIN Instructors i ON Teach.InstructorID = i.InstructorID
            LEFT JOIN Take t ON l.LessonID = t.LessonID
            LEFT JOIN Resorts r ON l.ResortID = r.ResortID
            GROUP BY l.LessonID, i.InstructorID, r.ResortID
            HAVING l.LessonID = %s
        """
        cursor.execute(query, (lesson_id,))
        results = cursor.fetchone()
        cursor.close()
        connection.close()
        return results
    except mysql.connector.Error as e:
        raise Exception(f"Database error: {e}")

def get_registered_lesson_by_user_id(user_id):
    try:
        with get_db_connection() as connection:
            with connection.cursor(dictionary=True) as cursor:
                query = """
                SELECT LessonID
                FROM Take
                WHERE UserID = %s
                """
                cursor.execute(query, (user_id,))
                lessons = cursor.fetchall()
                return lessons
    except mysql.connector.Error as db_err:
        raise db_err