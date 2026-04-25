from flask import Flask
from flask_cors import CORS, cross_origin
from server.routes.resorts_routes import resorts_bp
from server.routes.comments_routes import comments_bp
from server.routes.users_routes import users_bp
from server.routes.lesson_routes import lessons_bp
from server.routes.register_routes import registration_bp

server = Flask(__name__)

cors = CORS(server) # allow CORS for all domains on all routes.
server.config['CORS_HEADERS'] = 'Content-Type'

server.register_blueprint(resorts_bp)
server.register_blueprint(comments_bp)
server.register_blueprint(users_bp)
server.register_blueprint(lessons_bp)
server.register_blueprint(registration_bp)

if __name__ == '__main__':
    server.run(debug=True)