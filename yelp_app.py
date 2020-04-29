# Import necessary libraries
from flask import Flask, render_template, redirect, jsonify
from flask_pymongo import PyMongo
from flask_cors import CORS
import json
from bson import json_util
from bson.json_util import dumps

# Create instance of Flask app
app = Flask(__name__)
CORS(app)

# Use flask_pymongo to set up mongo connection
app.config["MONGO_URI"] = "mongodb://localhost:27017/yelp_dataset"
mongo = PyMongo(app)

# Create route that finds the Yelp businesses document from Mongo
@app.route("/businesses/top_3_cities")
def cities():

    all_cities = mongo.db.all_businesses.aggregate([
            {
            '$group': {
                '_id': '$city', 
                'count': {
                    '$sum': 1
                }
            }
        }, {
            '$sort': {
                'count': -1
            }
        }, {
            '$limit': 1
        }
    ])

    yelp_cities = []
    
    for city in all_cities:
        yelp_cities.append(city)

    yelp_cities = json.dumps(yelp_cities, default=json_util.default)
    return yelp_cities

# Create route that finds the Yelp businesses document from Mongo
@app.route("/businesses/<city>")
def businesses(city):

    # Find data based on selected city
    if (city == "Las Vegas"): 
        businesses = mongo.db.las_vegas_businesses.find()
    elif (city == "Phoenix"):
        businesses = mongo.db.phoenix_businesses.find()
    else:
        businesses = mongo.db.toronto_businesses.find()   

    yelp_business_data = []
    
    for business in businesses:
        yelp_business_data.append(business)

    yelp_business_data = json.dumps(yelp_business_data, default=json_util.default)
    return yelp_business_data

# Create route that finds the Yelp businesses summary document from Mongo
@app.route("/businesses/<city>/summary_data")
def summary_data(city):

    # Find data based on selected city
    if (city == "Las Vegas"):
        business_summary = mongo.db.las_vegas_business_summary.find()
    elif (city == "Phoenix"):
        business_summary = mongo.db.phoenix_business_summary.find()
    else:
        business_summary = mongo.db.toronto_business_summary.find() 

    yelp_business_summary_data = []
    
    for summary_data in business_summary:
        yelp_business_summary_data.append(summary_data)

    yelp_business_summary_data = json.dumps(yelp_business_summary_data, default=json_util.default)
    return yelp_business_summary_data

# Create route that finds the Yelp businesses summary document from Mongo
@app.route("/businesses/<city>/biz_cat_summary")
def biz_cat_summary_data(city):

    # Find data based on selected city
    if (city == "Las Vegas"):
        biz_cat_summary = mongo.db.las_vegas_biz_cat_summary.find()
    elif (city == "Phoenix"):
        biz_cat_summary = mongo.db.phoenix_biz_cat_summary.find()
    else:
        biz_cat_summary = mongo.db.toronto_biz_cat_summary.find() 

    yelp_biz_cat_summary_data = []
    
    for summary_data in biz_cat_summary:
        yelp_biz_cat_summary_data.append(summary_data)

    yelp_biz_cat_summary_data = json.dumps(yelp_biz_cat_summary_data, default=json_util.default)
    return yelp_biz_cat_summary_data

# Create route that finds the Yelp tips data from Mongo
@app.route("/businesses/<city>/tips")
def tips(city):

    # Find data based on selected city
    if (city == "Las Vegas"):
        business_tips = mongo.db.las_vegas_businesses_tips.find()
    elif (city == "Phoenix"):
        business_tips = mongo.db.phoenix_businesses_tips.find()
    else:
        business_tips = mongo.db.toronto_businesses_tips.find() 

    yelp_tips_data = []
    
    for business_tip in business_tips:
        yelp_tips_data.append(business_tip)

    yelp_tips_data = json.dumps(yelp_tips_data, default=json_util.default)
    return yelp_tips_data

# Create route that finds the Yelp tips data from Mongo
@app.route("/businesses/<city>/checkins")
def checkins(city):

    # Find data based on selected city
    if (city == "Las Vegas"):
        business_checkins = mongo.db.las_vegas_businesses_checkins.find()
    elif (city == "Phoenix"):
        business_checkins = mongo.db.phoenix_businesses_checkins.find()
    else:
        business_checkins = mongo.db.toronto_businesses_checkins.find() 

    yelp_checkins_data = []
    
    for checkins in business_checkins:
        yelp_checkins_data.append(checkins)

    yelp_checkins_data = json.dumps(yelp_checkins_data, default=json_util.default)
    return yelp_checkins_data

if __name__ == "__main__":
    app.run(debug=True)