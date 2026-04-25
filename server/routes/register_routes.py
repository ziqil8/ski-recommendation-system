from flask import Blueprint, jsonify, request
from server.controllers.register_con import register_for_lesson, cancel_registration, get_takes_by_user_id

# Create a Blueprint for registration and cancellation
registration_bp = Blueprint('registration', __name__)

# API: Register a user for a lesson
@registration_bp.route('/lessons/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        user_id = data.get('UserID')
        lesson_id = data.get('LessonID')

        # Check if UserID and LessonID are provided
        if not user_id or not lesson_id:
            return jsonify({'error': 'User ID and Lesson ID are required'}), 400

        # Ensure UserID and LessonID are integers
        try:
            user_id = int(user_id)
            lesson_id = int(lesson_id)
        except ValueError:
            return jsonify({'error': 'User ID and Lesson ID must be integers'}), 400

        # Call the controller function to handle registration
        result = register_for_lesson(user_id, lesson_id)

        if result['status'] == 'success':
            return jsonify({'message': result['message']}), 200
        else:
            return jsonify({'error': result['message']}), 400
    except Exception as e:
        return jsonify({'error': 'An unexpected error occurred', 'details': str(e)}), 500

# API: Cancel a user's registration for a lesson
@registration_bp.route('/lessons/cancel', methods=['POST'])
def cancel():
    try:
        data = request.get_json()
        user_id = data.get('UserID')
        lesson_id = data.get('LessonID')

        # Check if UserID and LessonID are provided
        if not user_id or not lesson_id:
            return jsonify({'error': 'User ID and Lesson ID are required'}), 400

        # Ensure UserID and LessonID are integers
        try:
            user_id = int(user_id)
            lesson_id = int(lesson_id)
        except ValueError:
            return jsonify({'error': 'User ID and Lesson ID must be integers'}), 400

        # Call the controller function to handle cancellation
        result = cancel_registration(user_id, lesson_id)

        if result['status'] == 'success':
            return jsonify({'message': result['message']}), 200
        else:
            return jsonify({'error': result['message']}), 400
    except Exception as e: return jsonify({'error': 'An unexpected error occurred', 'details': str(e)}), 500

@registration_bp.route('/lessons/takes/<int:user_id>', methods=['GET'])
def get_takes(user_id):
    try:
        result = get_takes_by_user_id(user_id)
        if not result:
            return jsonify({'error': f'No lessons found for UserID {user_id}'}), 404
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': 'An unexpected error occurred', 'details': str(e)}), 500
