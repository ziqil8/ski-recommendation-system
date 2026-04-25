from server.database.database import get_db_connection
import mysql.connector

def get_resorts_from_db():
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT * FROM Resorts")
    resorts = cursor.fetchall()
    cursor.close()
    connection.close()
    return resorts

def get_resort_by_id(resort_id):
    try:
        with get_db_connection() as connection:
            with connection.cursor(dictionary=True) as cursor:
                query = "SELECT * FROM Resorts WHERE ResortID = %s"
                cursor.execute(query, (resort_id,))
                resort = cursor.fetchone()
                return resort
    except mysql.connector.Error as db_err:
        raise db_err

def get_favorite_resorts_by_userid(user_id):
    try:
        with get_db_connection() as connection:
            with connection.cursor(dictionary=True) as cursor:
                query = "SELECT * FROM Resorts NATURAL JOIN Favorites WHERE UserID = %s"
                cursor.execute(query, (user_id,))
                resorts = cursor.fetchall()
                return resorts
    except mysql.connector.Error as db_err:
        raise db_err

def create_favorite_resorts_by_user_id_and_resort_id(user_id, resort_id):
    try:
        with get_db_connection() as connection:
            with connection.cursor(dictionary=True) as cursor:
                query = """
                INSERT INTO Favorites (ResortID, UserID)
                VALUES (%s, %s)"""
                cursor.execute(query, (resort_id, user_id,))
                connection.commit()
                return resort_id
    except mysql.connector.Error as db_err:
        raise db_err

def delete_favorite_resorts_by_user_id_and_resort_id(user_id, resort_id):
    try:
        with get_db_connection() as connection:
            with connection.cursor(dictionary=True) as cursor:
                query = """DELETE FROM Favorites WHERE ResortID = %s AND UserID = %s"""
                cursor.execute(query, (resort_id, user_id,))
                connection.commit()
                return resort_id
    except mysql.connector.Error as db_err:
        raise db_err

def get_popular_resorts_for_beginners():
    try:
        with get_db_connection() as connection:
            with connection.cursor(dictionary=True) as cursor:
                query = "CALL AdvancedResortQueries(1)"
                cursor.execute(query)
                resorts = cursor.fetchall()
                return resorts
    except mysql.connector.Error as db_err:
        raise db_err

def get_popular_resorts_for_intermediate():
    try:
        with get_db_connection() as connection:
            with connection.cursor(dictionary=True) as cursor:
                query = "CALL AdvancedResortQueries(2)"
                cursor.execute(query)
                resorts = cursor.fetchall()
                return resorts
    except mysql.connector.Error as db_err:
        raise db_err

def get_popular_resorts_for_pros():
    try:
        with get_db_connection() as connection:
            with connection.cursor(dictionary=True) as cursor:
                query = "CALL AdvancedResortQueries(3)"
                cursor.execute(query)
                resorts = cursor.fetchall()
                return resorts
    except mysql.connector.Error as db_err:
        raise db_err