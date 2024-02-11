from pymongo import MongoClient
from flask import Flask, jsonify, request
import json
from bson import json_util
from flask_cors import CORS

from datetime import datetime, timezone


import random
import pandas as pd
import time
from apscheduler.schedulers.background import BackgroundScheduler
import atexit

from sklearn.cluster import KMeans
from sklearn import datasets
from sklearn.utils import shuffle
import numpy as np
import matplotlib.pyplot as plt
from matplotlib.colors import ListedColormap
customcmap = ListedColormap(["crimson", "mediumblue", "darkmagenta","cyan","orange"])

# import db

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'


CONNECTION_STRING = "mongodb+srv://sid:3u4P5zdShi8CfAaR@cluster0.0hckrze.mongodb.net/?retryWrites=true&w=majority"
client = MongoClient(CONNECTION_STRING)
# Replace 'your_database_name' with your actual database name
db = client['cashkick']
# Replace 'your_collection_name' with your actual collection name
usertable = db['user']
playertable = db['players']
players = db['players']
bought_price = db['Bought_Price']


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
        player_cost = data.get('price')
        remaining_budget = data.get('remaining_budget')
        units = data.get('units')
        time = datetime.now()
        formatted_date = time.strftime("%Y-%m-%d %H:%M:%S %Z")

        if not player_details or not player_cost or not remaining_budget or units is None:
            return jsonify({'message': 'Invalid request data'}), 400

        player_details["time"] = formatted_date
        player_details["cost_per_unit"] = player_cost / units
        player_details["units"] = units

        usertable.update_one(
            {},
            {'$push': {'players': player_details},
                '$set': {'budget': remaining_budget}}
        )
        data_buy(remaining_budget, player_details['name'], formatted_date)

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
        player_to_sell = {
            'time': player_details['time'], 'units': units_to_sell}

        # Update user's budget and decrement the units of the sold player
        usertable.update_one({
            'players.time': player_details['time']
        }, {
            '$inc': {'budget': budget, 'players.$.units': -units_to_sell}
        })

        # Remove the player if units reach 0
        usertable.update_one({
            'players.time': player_details['time'],
            'players.units': {'$lte': 0}
        }, {
            '$pull': {'players': {'time': player_details['time']}}
        })

        profit_instance = bought_price.find_one(
                {'time': player_details['time']})

        player_info = players.find()

        current_price = {}

        for player in player_info:
            current_price[player["name"]] = player["price"]

        profit_table = {}

        for i in list(profit_instance['players'].keys()):
            profit_table[i] = current_price[i] - profit_instance['players'][i]

        print(profit_table)

        kmeans = train_model(profit_table)

        name = player_details["name"]

        profit = profit_table[name]

        print(profit)

        message = evaluate(profit, kmeans)[1]
        calculated_profit = evaluate(profit, kmeans)[0]
        

        change_percent = performance(calculated_profit, profit_instance['players'][name])

        return jsonify({'message': message}, {'performance': change_percent }), 200

    except Exception as e:
        print(e)
        return jsonify({'error': str(e)}), 500


def data_buy(budget, player_name, time):
    players = playertable.find({})
    other_players = {}
    for player in players:
        player_cost = player.get("price", 0)

        if int(player_cost) <= budget:
            other_players[player["name"]] = int(player_cost)

        else:
            other_players[player["name"]] = 0

        bought_price.update_one(
            {"time": time},
            {"$set": {"players": other_players}},
            upsert=True
        )


@app.route('/updateprice', methods=['POST', 'GET'])
def update_prices():
    rows = players.find({})
    print("Prices have been updated")
    for row in rows:
        value = int(row['price'])
        percentage_adjustment = 100 + random.uniform(3, -2)
        adjustment = (int(value * (percentage_adjustment / 100)))
        players.update_one({'_id':row['_id']},{'$set':{'price':adjustment}})
    update_portfolio()
    return "LOL"


@app.route('/updateportfolio', methods=['POST', 'GET'])
def update_portfolio():
    users = usertable.find({})
    for user in users:
        new_portfolio = 0
        for player in user['players']:
            name = player['name']
            rating = player['overall']
            player_found = players.find_one({'name':name,'overall':rating})
            new_portfolio+=player_found.get('price')
        wealth = new_portfolio+int(user['budget'])
        usertable.update_one({'_id':user['_id']},{'$set':{'wealth':wealth}})
    return 'lol'

@app.route('/import_data', methods=['POST','GET'])
def import_data():
    df = pd.read_csv('/Users/siddhantagarwal/Documents/GitHub/cashkick/data/data.csv')
    df['price'] = df['price'].str.replace(',','').astype(int)
    df['original_price'] = df['original_price'].str.replace(',','').astype(int)
    #df.columns = str(df.columns)
    #df.index = str(df.index)
    data = df.to_dict(orient='records')
    print(data)
    players.insert_many(data)
    return "lol"

def reset_prices():
    players_found = players.find({})
    for player in players_found:
        players.update_one({'_id': player['_id']}, {'$set': {'price': player['original_price']}})
        
def train_model(dic):
    df = pd.DataFrame.from_dict(dic.items())
    df.columns = ['Name','price']

    df['price'] = df['price'].replace(',', '', regex=True).astype(float)

    constant_value = 10

    X = np.array(df['price']).reshape(-1, 1)
    X = np.hstack((X, np.full_like(X, constant_value)))

    model = KMeans(n_clusters=5, random_state=42)
    kmeans = model.fit(X)
    return(kmeans)


def evaluate(profit,kmeans):
    cluster = kmeans.predict([[profit,10]])
    if cluster == 2:
        reward = [profit + abs(profit* 0.04),"Congratulations! You've made an exceptional trade. This could be one of your best moves, resulting in significant gains. Well done! As a reward, you are being awarded with an extra 4% of the profits you have made."]
        return reward
    if cluster == 4:
        reward = [profit + abs(profit* 0.02),"Great job! Your trade looks promising and has the potential for positive returns. Keep up the good work in making smart investment decisions. As a reward, you are being awarded with an extra 2% of the profits you have made."]
        return reward
    if cluster == 0:
        reward = [profit,"You've made a reasonable trade. While it may not be a standout move, it appears to be a solid decision that aligns with your overall strategy."]
        return reward
    if cluster == 3:
        reward = [profit - abs(profit* 0.02),"This trade might not have gone as planned. It's important to reassess your strategy and consider adjusting your approach for better outcomes in the future. As a penalty, we are deducting 2% of the money you have made."]
        return reward
    if cluster == 1:
        reward = [profit - abs(profit* 0.04),"Unfortunately, this trade did not go well. It happens to the best of us. Learn from the experience, analyze what went wrong, and use it to improve your future decisions. As a penalty, we are deducting 4% of the money you have made."]
        return reward


def plot(kmeans,X):
    figure = plt.figure(figsize=(15, 5))
    ax1 = figure.add_subplot(1, 2, 1)
    scatter = ax1.scatter(X[:, 0], X[:, 1],
                          c=kmeans.labels_.astype(float),
                          edgecolor="k", s=150, cmap=customcmap)
    ax1.set_xlabel("Price", fontsize=12)
    ax1.set_ylabel("Constant", fontsize=12)
    ax1.yaxis.set_visible(False)
    ax1.set_title("K-Means Clusters", fontsize=12)
    plt.show()

def performance(profit, og_price):
    return(profit*100/og_price)

if __name__ == '__main__': 
    reset_prices()
    scheduler = BackgroundScheduler()
    scheduler.add_job(func=update_prices, trigger="interval", minutes=0.5)
    scheduler.start()
    atexit.register(lambda: scheduler.shutdown())
    app.run(port=8000, debug=True)
