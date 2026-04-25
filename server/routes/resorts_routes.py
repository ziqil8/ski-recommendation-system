from flask import Blueprint, jsonify, request
from server.controllers.resorts_con import get_resorts_from_db, get_resort_by_id, get_favorite_resorts_by_userid, create_favorite_resorts_by_user_id_and_resort_id, delete_favorite_resorts_by_user_id_and_resort_id, get_popular_resorts_for_beginners, get_popular_resorts_for_intermediate, get_popular_resorts_for_pros

resorts_bp = Blueprint('resorts', __name__)

@resorts_bp.route('/resorts/all', methods=['GET'])
def get_all_resorts():
    try:
        resorts = get_resorts_from_db()

        return jsonify(resorts), 200
    except Exception as e:
        return jsonify({'error': 'An unexpected error occurred', 'details': str(e)}), 500

@resorts_bp.route('/resorts/<int:resort_id>', methods=['GET'])
def get_resort(resort_id):
    try:
        resort = get_resort_by_id(resort_id)
        if not resort:
            return jsonify({'error': 'Invalid resort ID provided'}), 404
        return jsonify(resort), 200
    except Exception as e:
        return jsonify({'error': 'An unexpected error occurred', 'details': str(e)}), 500

@resorts_bp.route('/resorts/favorites/<string:user_id>', methods=['GET'])
def get_favorite_resorts(user_id):
    result = []
    try:
        resorts = get_favorite_resorts_by_userid(user_id)

        for resort in resorts:
            item = {
                "resort_id": resort["ResortID"],
                "resortName": resort["ResortName"],
                "location": resort["CountryName"],
                "price": resort["DayPassPrice"],
                "rating": resort["AverageRating"],
            }

            total_slopes = resort["BeginnerSlope"] + resort["IntermediateSlope"] + resort["DifficultSlope"]
            if total_slopes == 0:
                item["difficulty"] = "Unknown"
            else:
                if resort["BeginnerSlope"] / total_slopes > 0.5:
                    item["difficulty"] = "Beginner"
                elif resort["DifficultSlope"] / total_slopes > 0.2:
                    item["difficulty"] = "Hard"
                else:
                    item["difficulty"] = "Intermediate"

            result.append(item)

        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': 'An unexpected error occurred', 'details': str(e)}), 500

@resorts_bp.route('/resorts/favorites/add', methods=['POST'])
def create_favorite_resorts():
    data = request.get_json()
    try:
        result = create_favorite_resorts_by_user_id_and_resort_id(data["user_id"], data["resort_id"])
        return {"resort_id": result}, 200
    except Exception as e:
        return jsonify({'error': 'An unexpected error occurred', 'details': str(e)}), 500

@resorts_bp.route('/resorts/favorites/delete', methods=['DELETE'])
def remove_favorite_resorts():
    data = request.get_json()
    try:
        result = delete_favorite_resorts_by_user_id_and_resort_id(data["user_id"], data["resort_id"])
        return {"resort_id": result}, 200
    except Exception as e:
        return jsonify({'error': 'An unexpected error occurred', 'details': str(e)}), 500
    
@resorts_bp.route('/resorts/popular/beginner', methods=['GET'])
def get_all_popular_resorts_for_beginners():
    result = []
    try:
        resorts = get_popular_resorts_for_beginners()

        for resort in resorts:
            item = {
                "resort_id": resort["ResortID"],
                "resortName": resort["ResortName"],
                "location": resort["CountryName"],
                "price": resort["DayPassPrice"],
                "rating": resort["AverageRating"],
            }

            total_slopes = resort["BeginnerSlope"] + resort["IntermediateSlope"] + resort["DifficultSlope"]
            if total_slopes == 0:
                item["difficulty"] = "Unknown"
            else:
                if resort["BeginnerSlope"] / total_slopes > 0.5:
                    item["difficulty"] = "Beginner"
                elif resort["DifficultSlope"] / total_slopes > 0.2:
                    item["difficulty"] = "Hard"
                else:
                    item["difficulty"] = "Intermediate"

            result.append(item)

        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': 'An unexpected error occurred', 'details': str(e)}), 500
    
@resorts_bp.route('/resorts/popular/intermediate', methods=['GET'])
def get_all_popular_resorts_for_intermediate():
    result = []
    try:
        resorts = get_popular_resorts_for_intermediate()

        for resort in resorts:
            item = {
                "resort_id": resort["ResortID"],
                "resortName": resort["ResortName"],
                "location": resort["CountryName"],
                "price": resort["DayPassPrice"],
                "rating": resort["AverageRating"],
            }

            total_slopes = resort["BeginnerSlope"] + resort["IntermediateSlope"] + resort["DifficultSlope"]
            if total_slopes == 0:
                item["difficulty"] = "Unknown"
            else:
                if resort["BeginnerSlope"] / total_slopes > 0.5:
                    item["difficulty"] = "Beginner"
                elif resort["DifficultSlope"] / total_slopes > 0.2:
                    item["difficulty"] = "Hard"
                else:
                    item["difficulty"] = "Intermediate"

            result.append(item)

        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': 'An unexpected error occurred', 'details': str(e)}), 500

@resorts_bp.route('/resorts/popular/difficult', methods=['GET'])
def get_all_popular_resorts_for_pros():
    result = []
    try:
        resorts = get_popular_resorts_for_pros()

        for resort in resorts:
            item = {
                "resort_id": resort["ResortID"],
                "resortName": resort["ResortName"],
                "location": resort["CountryName"],
                "price": resort["DayPassPrice"],
                "rating": resort["AverageRating"],
            }

            total_slopes = resort["BeginnerSlope"] + resort["IntermediateSlope"] + resort["DifficultSlope"]
            if total_slopes == 0:
                item["difficulty"] = "Unknown"
            else:
                if resort["BeginnerSlope"] / total_slopes > 0.5:
                    item["difficulty"] = "Beginner"
                elif resort["DifficultSlope"] / total_slopes > 0.2:
                    item["difficulty"] = "Hard"
                else:
                    item["difficulty"] = "Intermediate"

            result.append(item)

        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': 'An unexpected error occurred', 'details': str(e)}), 500        