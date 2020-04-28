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
@app.route("/businesses/toronto")
def businesses():

    # Find data
    toronto_businesses = mongo.db.toronto_businesses.find()

    yelp_business_data = []
    
    for toronto_business in toronto_businesses:
        yelp_business_data.append(toronto_business)

    yelp_business_data = json.dumps(yelp_business_data, default=json_util.default)
    return yelp_business_data

# Create route that finds the Yelp businesses summary document from Mongo
@app.route("/businesses/toronto/summary_data")
def summary_data():

    # Find data
    toronto_business_summary = mongo.db.toronto_business_summary.find()

    yelp_business_summary_data = []
    
    for toronto_business in toronto_business_summary:
        yelp_business_summary_data.append(toronto_business)

    yelp_business_summary_data = json.dumps(yelp_business_summary_data, default=json_util.default)
    return yelp_business_summary_data

# Create route that finds the Yelp businesses summary document from Mongo
@app.route("/businesses/toronto/biz_cat_summary")
def biz_cat_summary_data():

    # Find data
    toronto_biz_cat_summary = mongo.db.toronto_biz_cat_summary.find()

    yelp_biz_cat_summary_data = []
    
    for toronto_biz_cat in toronto_biz_cat_summary:
        yelp_biz_cat_summary_data.append(toronto_biz_cat)

    yelp_biz_cat_summary_data = json.dumps(yelp_biz_cat_summary_data, default=json_util.default)
    return yelp_biz_cat_summary_data

# Create route that finds the Yelp tips data from Mongo
@app.route("/businesses/toronto/tips")
def tips():

    # Find data
    toronto_business_tips = mongo.db.toronto_businesses_tips.find()

    yelp_tips_data = []
    
    for tip in toronto_business_tips:
        yelp_tips_data.append(tip)

    yelp_tips_data = json.dumps(yelp_tips_data, default=json_util.default)
    return yelp_tips_data

# Create route that finds the Yelp tips data from Mongo
@app.route("/businesses/toronto/checkins")
def checkins():

    # Find data
    toronto_business_checkins = mongo.db.toronto_businesses_checkins.find()

    yelp_checkins_data = []
    
    for checkin in toronto_business_checkins:
        yelp_checkins_data.append(checkin)

    yelp_checkins_data = json.dumps(yelp_checkins_data, default=json_util.default)
    return yelp_checkins_data

if __name__ == "__main__":
    app.run(debug=True)