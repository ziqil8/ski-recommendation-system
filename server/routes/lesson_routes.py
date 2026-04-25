from flask import Blueprint, jsonify
from server.controllers.lessons_con import get_lessons_by_resort_id, get_lesson_by_id, get_registered_lesson_by_user_id
from server.controllers.resorts_con import get_resort_by_id

lessons_bp = Blueprint('lessons', __name__)

# API: Get lessons by resort_id
@lessons_bp.route('/lessons/resorts/<int:resort_id>', methods=['GET'])
def get_lessons(resort_id):
    try:
        resort = get_resort_by_id(resort_id)
        print(resort)
        if not resort:
            return jsonify({'error': 'Invalid resort ID provided'}), 404
        lessons = get_lessons_by_resort_id(resort_id)
        return jsonify(lessons), 200
    except Exception as e:
        return jsonify({'error': 'An unexpected error occurred', 'details': str(e)}), 500

@lessons_bp.route('/lessons/<int:lesson_id>', methods=['GET'])
def get_lesson(lesson_id):
    try:
        # Fetch lesson by lesson_id
        lesson = get_lesson_by_id(lesson_id)
        if not lesson:
            return jsonify({'error': 'Invalid lesson ID provided'}), 404

        return jsonify(lesson), 200
    except Exception as e:
        return jsonify({'error': 'An unexpected error occurred', 'details': str(e)}), 500

@lessons_bp.route('/lessons/registered/<int:user_id>', methods=['GET'])
def get_registered_lesson(user_id):
    try:
        lessons = get_registered_lesson_by_user_id(user_id)

        return jsonify(lessons), 200
    except Exception as e:
        return jsonify({'error': 'An unexpected error occurred', 'details': str(e)}), 500