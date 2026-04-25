from flask import Blueprint, jsonify, request
from server.controllers.comments_con import get_comments_by_resort,create_new_comment,update_comment,delete_comment,get_comment_by_id,get_all_comments_from_db
from server.controllers.comments_con import get_comments_by_lesson, get_all_instructor_comments_from_db, create_new_instructor_comment, get_instructor_comment_by_id, update_instructor_comment, delete_instructor_comment
from server.controllers.resorts_con import get_resort_by_id
from server.controllers.lessons_con import get_lesson_by_id

comments_bp = Blueprint('comments_bp', __name__)

# API1: Get all comments
@comments_bp.route('/comments/resorts', methods=['GET'])
def get_all_comments():
    try:
        comments = get_all_comments_from_db()
        return jsonify(comments), 200
    except Exception as e:
        return jsonify({'error': 'An unexpected error occurred', 'details': str(e)}), 500


# API2: Get comments by resort_id
@comments_bp.route('/comments/resorts/<int:resort_id>', methods=['GET'])
def get_comments(resort_id):
    try:
        resort = get_resort_by_id(resort_id)
        if not resort:
            return jsonify({'error': 'Invalid resort ID provided'}), 404
        comments = get_comments_by_resort(resort_id)
        return jsonify(comments), 200
    except Exception as e:
        return jsonify({'error': 'An unexpected error occurred', 'details': str(e)}), 500
 
    
# API3: Create a new resort comment
@comments_bp.route('/comments/resorts/new', methods=['POST'])
def create_comment():
    data = request.get_json()
    if 'ResortID' not in data or 'UserID' not in data:
        return jsonify({'error': 'Missing required fields'}), 400
    # check if rating is valid
    if not isinstance(data['Rating'], int) or not (0 <= data['Rating'] <= 5):
        return jsonify({'error': 'Rating must be an integer between 0 and 5'}), 400
    try:
        new_comment = create_new_comment(data)
        return jsonify(new_comment), 200
    except Exception as e:
        return jsonify({'error': 'An unexpected error occurred', 'details': str(e)}), 500


# API4: Update an existing resort comment
# get commentID, get the content first, check whether the userID matches
@comments_bp.route('/comments/resorts/<int:comment_id>/update', methods=['PUT'])
def update_comment_route(comment_id):
    data = request.get_json()
    data["Rating"] = int(data["Rating"])
    if 'UserID' not in data or 'CommentText' not in data or 'Rating' not in data:
        return jsonify({'error': 'Missing required fields'}), 400
    if not isinstance(data['Rating'], int) or not (0 <= data['Rating'] <= 5):
        return jsonify({'error': 'Rating must be an integer between 0 and 5'}), 400
    data['ResortCommentID'] = comment_id
    try:
        existing_comment = get_comment_by_id(comment_id)
        if not existing_comment:
            return jsonify({'error': 'Comment not found'}), 404
        if 'UserID' not in data or int(data['UserID']) != int(existing_comment['UserID']):
            return jsonify({'error': 'UserID does not match or is missing'}), 400
        # print(f"Request UserID: {data.get('UserID')}, Existing Comment UserID: {existing_comment.get('UserID')}")
        if 'CommentText' not in data or 'Rating' not in data:
            return jsonify({'error': 'Missing required fields'}), 400
        if not isinstance(data['Rating'], int) or not (0 <= data['Rating'] <= 5):
            return jsonify({'error': 'Rating must be an integer between 0 and 5'}), 400
        data['ResortCommentID'] = comment_id
        update_comment(data)
        return jsonify({'message': 'Comment updated successfully'}), 200

    except Exception as e:
        return jsonify({'error': 'An unexpected error occurred', 'details': str(e)}), 500


# API5: Delete a resort comment
@comments_bp.route('/comments/resorts/<int:comment_id>/delete', methods=['DELETE'])
def delete_comment_route(comment_id):
    data = request.get_json()
    try:
        existing_comment = get_comment_by_id(comment_id)
        if not existing_comment:
            return jsonify({'error': 'Comment not found'}), 404
        if 'UserID' not in data or int(data['UserID']) != int(existing_comment['UserID']):
            return jsonify({'error': 'UserID does not match or is missing'}), 400
        delete_comment(comment_id, data['UserID'])
        return jsonify({'message': 'Comment deleted successfully'}), 200
    except Exception as e:
        return jsonify({'error': 'An unexpected error occurred', 'details': str(e)}), 500
  

# API6: Get all instructor comments
@comments_bp.route('/comments/instructors', methods=['GET'])
def get_all_instructor_comments():
    try:
        comments = get_all_instructor_comments_from_db()
        return jsonify(comments), 200
    except Exception as e:
        return jsonify({'error': 'An unexpected error occurred', 'details': str(e)}), 500

 
# API7: Get instructor comments by instructor_id
@comments_bp.route('/comments/instructors/<int:lesson_id>', methods=['GET'])
def get_instructor_comments(lesson_id):
    try:
        comments = get_comments_by_lesson(lesson_id)
        return jsonify(comments), 200
    except Exception as e:
        return jsonify({'error': 'An unexpected error occurred', 'details': str(e)}), 500


# API8: Create a new instructor comment
@comments_bp.route('/comments/instructors/new', methods=['POST'])
def create_instructor_comment():
    data = request.get_json()
    if 'InstructorID' not in data or 'UserID' not in data:
        return jsonify({'error': 'Missing required fields'}), 400
    # check if rating is valid
    if not isinstance(data['Rating'], int) or not (0 <= data['Rating'] <= 5):
        return jsonify({'error': 'Rating must be an integer between 0 and 5'}), 400
    try:
        new_comment = create_new_instructor_comment(data)
        return jsonify(new_comment), 200
    except Exception as e:
        return jsonify({'error': 'An unexpected error occurred', 'details': str(e)}), 500


# API9: Update an existing instructor comment
@comments_bp.route('/comments/instructors/<int:comment_id>/update', methods=['PUT'])
def update_one_nstructor_comment(comment_id):
    data = request.get_json()
    # print(data)
    data["Rating"] = int(data["Rating"])
    if 'UserID' not in data or 'CommentText' not in data or 'Rating' not in data:
        return jsonify({'error': 'Missing required fields'}), 400
    if not isinstance(data['Rating'], int) or not (0 <= data['Rating'] <= 5):
        return jsonify({'error': 'Ratisng must be an integer between 0 and 5'}), 400
    data['InstructorCommentID'] = comment_id
    try:
        existing_comment = get_instructor_comment_by_id(comment_id)
        # print(existing_comment)
        if not existing_comment:
            return jsonify({'error': 'Comment not found'}), 404
        if 'UserID' not in data or int(data['UserID']) != int(existing_comment['UserID']):
            return jsonify({'error': 'UserID does not match or is missing'}), 400
        if 'CommentText' not in data or 'Rating' not in data:
            return jsonify({'error': 'Missing required fields'}), 400
        if not isinstance(data['Rating'], int) or not (0 <= data['Rating'] <= 5):
            return jsonify({'error': 'Rating must be an integer between 0 and 5'}), 400
        data['InstructorCommentID'] = comment_id
        update_instructor_comment(data)
        return jsonify({'message': 'Comment updated successfully'}), 200
    except Exception as e:
        return jsonify({'error': 'An unexpected error occurred', 'details': str(e)}), 500


# API10: Delete an instructor comment
@comments_bp.route('/comments/instructors/<int:comment_id>/delete', methods=['DELETE'])
def delete_one_instructor_comment(comment_id):
    data = request.get_json()
    try:
        existing_comment = get_instructor_comment_by_id(comment_id)
        if not existing_comment:
            return jsonify({'error': 'Comment not found'}), 404
        if 'UserID' not in data or int(data['UserID']) != int(existing_comment['UserID']):
            return jsonify({'error': 'UserID does not match or is missing'}), 400
        delete_instructor_comment(comment_id, data['UserID'])
        return jsonify({'message': 'Comment deleted successfully'}), 200
    except Exception as e:
        return jsonify({'error': 'An unexpected error occurred', 'details': str(e)}), 500
