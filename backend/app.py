from pymongo import MongoClient
from flask import Flask, jsonify, request
import json
from bson import json_util
from flask_cors import CORS
# import db

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'


CONNECTION_STRING = "mongodb+srv://gharatayush27:IhCy4nAxrSecDipw@cluster0.0hckrze.mongodb.net/?retryWrites=true&w=majority"
client = MongoClient(CONNECTION_STRING)
# Replace 'your_database_name' with your actual database name
db = client['cashkick']
# Replace 'your_collection_name' with your actual collection name
usertable = db['user']
playertable = db['collection']


@app.route('/')
def flask_mongodb_atlas():
    return "flask mongodb atlas"


@app.route('/user')
def test():
    user = usertable.find_one()
    return json.loads(json_util.dumps(user))


@app.route('/search/player', methods=['POST'])
def search_player():
    try:
        data = request.get_json()
        player_name = data.get('player_name')

        if player_name:
            # Case-insensitive search for player by name
            player = playertable.find_one(
                {'name': {'$regex': player_name, '$options': 'i'}})

            if player:
                return json.loads(json_util.dumps(player))
            else:
                return jsonify({'message': 'Player not found'}), 404
        else:
            return jsonify({'message': 'Please provide a player name for search'}), 400

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/buy/player', methods=['POST'])
def buy_player():
    try:
        data = request.get_json()
        player_details = data.get('player_details')
        player_cost = data.get('cost')
        remaining_budget = data.get('remaining_budget')
        units = data.get('units')

        if not player_details or not player_cost or not remaining_budget or units is None:
            return jsonify({'message': 'Invalid request data'}), 400

        # Check if the player already exists in the user's players array
        existing_player = usertable.find_one({'players.name': player_details['name']})

        if existing_player:
            # If the player exists, update the units property
            usertable.update_one(
                {'players.name': player_details['name']},
                {'$inc': {'players.$.units': units},
                 '$push': {'players.$.purchase_history': {
                     'cost_per_unit': player_cost,
                     'total_units': units
                 }},
                 '$set': {'budget': remaining_budget}}
            )
        else:
            # If the player doesn't exist, add the new player to the array
            player_details['units'] = units
            player_details['purchase_history'] = [{
                'cost_per_unit': player_cost,
                'total_units': units
            }]
            usertable.update_one(
                {},
                {'$push': {'players': player_details}, '$set': {'budget': remaining_budget}}
            )

        return jsonify({'message': 'Player purchased successfully'}), 200

    except Exception as e:
        print(e)
        return jsonify({'error': str(e)}), 500


@app.route('/sell/player', methods=['POST'])
def sell_player():
    try:
        data = request.get_json()
        player_details = data.get('player_details')
        budget = data.get('budget')
        units_to_sell = data.get('units')

        if not player_details or not budget or units_to_sell is None:
            return jsonify({'message': 'Invalid request data'}), 400

        # Adjust the units of the player being sold
        player_to_sell = {'name': player_details['name'], 'units': units_to_sell}

        # Update user's budget and decrement the units of the sold player
        usertable.update_one({
            'players.name': player_details['name']
        }, {
            '$inc': {'budget': budget, 'players.$.units': -units_to_sell}
        })

        # Remove the player if units reach 0
        usertable.update_one({
            'players.name': player_details['name'],
            'players.units': {'$lte': 0}
        }, {
            '$pull': {'players': {'name': player_details['name']}}
        })

        return jsonify({'message': 'Player sold successfully'}), 200

    except Exception as e:
        print(e)
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(port=8000, debug=True)
