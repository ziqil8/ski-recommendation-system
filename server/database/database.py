import mysql.connector

def get_db_connection():
    connection = mysql.connector.connect(
        host="34.16.45.71",          
        user="ZoeBackend",           
        password="088_open_to_work", 
        database="skiresort"         
    )
    return connection
