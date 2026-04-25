from flask import Blueprint, jsonify, request
from server.controllers.users_con import user_login, user_register
users_bp = Blueprint('users', __name__)

@users_bp.route('/users/login', methods=['POST'])
def handle_login():
    data = request.get_json()
    try:
        result = user_login(data["email"], data["password"])
        if not result:
            return jsonify({'error': 'Wrong email or wrong password'}), 400
        del result["Password"]
        return result, 200
    except Exception as e:
        return jsonify({'error': 'An unexpected error occurred', 'details': str(e)}), 500

@users_bp.route('/users/register', methods=['POST'])
def handle_register():
    data = request.get_json()
    try:
        result = user_register(data["username"], data["email"], data["password"])
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': 'An unexpected error occurred', 'details': str(e)}), 500