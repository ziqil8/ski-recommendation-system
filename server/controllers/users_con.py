from server.database.database import get_db_connection
import mysql.connector
import uuid

def user_login(email, password):
    try:
        with get_db_connection() as connection:
            with connection.cursor(dictionary=True) as cursor:
                query = "SELECT * FROM Users WHERE UserEmail = %s AND Password = %s"
                cursor.execute(query, (email, password,))
                resort = cursor.fetchone()
                return resort
    except mysql.connector.Error as db_err:
        raise db_err

def user_register(username, email, password):
    try:
        with get_db_connection() as connection:
            with connection.cursor(dictionary=True) as cursor:
                sql_insert = """
                INSERT INTO Users (UsersName, UserEmail, Password, Status)
                VALUES (%s, %s, %s, %s)
                """
                cursor.execute(sql_insert, (username, email, password, "Normal"))
                
                connection.commit()
                return {"message": "Success"}
    except mysql.connector.Error as db_err:
        raise db_err