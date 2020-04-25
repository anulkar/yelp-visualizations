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
    
    # return yelp_business_data
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
    
    # return yelp_business_data
    for toronto_business in toronto_business_summary:
        yelp_business_summary_data.append(toronto_business)

    yelp_business_summary_data = json.dumps(yelp_business_summary_data, default=json_util.default)
    return yelp_business_summary_data

if __name__ == "__main__":
    app.run(debug=True)