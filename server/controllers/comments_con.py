from server.database.database import get_db_connection
import mysql.connector

# resorts comments controllers
# get all comments
def get_all_comments_from_db():
    try:
        with get_db_connection() as connection:
            with connection.cursor(dictionary=True) as cursor:
                query = "SELECT * FROM ResortComments"
                cursor.execute(query)
                comments = cursor.fetchall()
                return comments
    except mysql.connector.Error as db_err:
        raise db_err

# get comments by resort ID
def get_comments_by_resort(resort_id):
    try:
        with get_db_connection() as connection:
            with connection.cursor(dictionary=True) as cursor:
                query = "SELECT UsersName, ResortCommentID, Rating, CommentText, ResortID FROM ResortComments NATURAL JOIN Users WHERE ResortID = %s"
                cursor.execute(query, (resort_id,))
                comments = cursor.fetchall()
                return comments
    except mysql.connector.Error as db_err:
        raise db_err

# create a new comment
def create_new_comment(data):
    try:
        with get_db_connection() as connection:
            with connection.cursor(dictionary=True) as cursor:
                sql_insert = """
                INSERT INTO ResortComments (ResortID, UserID, CommentText, Rating)
                VALUES (%s, %s, %s, %s)
                """
                cursor.execute(sql_insert, (data['ResortID'], data['UserID'], data.get('CommentText', ''), data['Rating']))
                inserted_id = cursor.lastrowid
                
                sql_select = """SELECT ResortCommentID, Rating, CommentText, ResortID FROM ResortComments WHERE ResortCommentID = %s"""
                cursor.execute(sql_select, (inserted_id,))
                new_comment = cursor.fetchone()
                
                connection.commit()
                return new_comment
    except mysql.connector.Error as db_err:
        raise db_err
    
# get comment by id, helper method
def get_comment_by_id(comment_id):
    try:
        with get_db_connection() as connection:
            with connection.cursor(dictionary=True) as cursor:
                sql = "SELECT * FROM ResortComments WHERE ResortCommentID = %s"
                cursor.execute(sql, (comment_id,))
                return cursor.fetchone()
    except mysql.connector.Error as db_err:
        raise db_err
    
# update an existing comment
def update_comment(data):
    try:
        with get_db_connection() as connection:
            with connection.cursor() as cursor:
                sql = """
                UPDATE ResortComments
                SET CommentText = %s, Rating = %s
                WHERE ResortCommentID = %s AND UserID = %s
                """
                cursor.execute(sql, (data['CommentText'], data['Rating'], data['ResortCommentID'], data['UserID']))
                connection.commit()
    except mysql.connector.Error as db_err:
        raise db_err

# delete an existing comment
def delete_comment(comment_id, user_id):
    try:
        with get_db_connection() as connection:
            with connection.cursor() as cursor:
                sql = """
                DELETE FROM ResortComments WHERE ResortCommentID = %s AND UserID = %s
                """
                cursor.execute(sql, (comment_id, user_id))
                connection.commit()
                if cursor.rowcount == 0:
                    raise ValueError("Comment not found or user unauthorized to delete.")
    except mysql.connector.Error as db_err:
        raise db_err
    
    
# instructors comments controllers
def get_all_instructor_comments_from_db():
    try:
        with get_db_connection() as connection:
            with connection.cursor(dictionary=True) as cursor:
                query = "SELECT * FROM InstructorComments"
                cursor.execute(query)
                comments = cursor.fetchall()
                return comments
    except mysql.connector.Error as db_err:
        raise db_err

def get_comments_by_lesson(lesson_id):
    try:
        with get_db_connection() as connection:
            with connection.cursor(dictionary=True) as cursor:
                query = "SELECT UsersName, InstructorCommentID, Rating, CommentText FROM Lessons NATURAL JOIN Teach NATURAL JOIN Instructors NATURAL JOIN InstructorComments NATURAL JOIN Users WHERE LessonID = %s"
                cursor.execute(query, (lesson_id,))
                comments = cursor.fetchall()
                return comments
    except mysql.connector.Error as db_err:
        raise db_err

def create_new_instructor_comment(data):
    try:
        with get_db_connection() as connection:
            with connection.cursor(dictionary=True) as cursor:
                query = """
                INSERT INTO InstructorComments (InstructorID, UserID, CommentText, Rating)
                VALUES (%s, %s, %s, %s)
                """
                cursor.execute(query, (data['InstructorID'], data['UserID'], data.get('CommentText', ''), data['Rating']))
                inserted_id = cursor.lastrowid
                
                sql_select = """SELECT InstructorCommentID, Rating, CommentText, InstructorID FROM InstructorComments WHERE InstructorCommentID = %s"""
                cursor.execute(sql_select, (inserted_id,))
                new_comment = cursor.fetchone()
                
                connection.commit()
                return new_comment
    except mysql.connector.Error as db_err:
        raise db_err

# helper
def get_instructor_comment_by_id(comment_id):
    try:
        with get_db_connection() as connection:
            with connection.cursor(dictionary=True) as cursor:
                query = "SELECT * FROM InstructorComments WHERE InstructorCommentID = %s"
                cursor.execute(query, (comment_id,))
                comment = cursor.fetchone()
                return comment
    except mysql.connector.Error as db_err:
        raise db_err

def update_instructor_comment(data):
    try:
        with get_db_connection() as connection:
            with connection.cursor() as cursor:
                query = """
                UPDATE InstructorComments
                SET CommentText = %s, Rating = %s
                WHERE InstructorCommentID = %s AND UserID = %s
                """
                cursor.execute(query, (data['CommentText'], data['Rating'], data['InstructorCommentID'], data['UserID']))
                connection.commit()
    except mysql.connector.Error as db_err:
        raise db_err

def delete_instructor_comment(comment_id, user_id):
    try:
        with get_db_connection() as connection:
            with connection.cursor() as cursor:
                query = """
                DELETE FROM InstructorComments WHERE InstructorCommentID = %s AND UserID = %s
                """
                cursor.execute(query, (comment_id, user_id))
                connection.commit()
                if cursor.rowcount == 0:
                    raise ValueError("Comment not found or user unauthorized to delete.")
    except mysql.connector.Error as db_err:
        raise db_err
