import json
import os
import pymongo

# Setup connection to mongodb
conn = "mongodb://localhost:27017"
client = pymongo.MongoClient(conn)

# Select database and collections to use
db = client.yelp_dataset
all_businesses = db.all_businesses
all_tips = db.all_tips
all_checkins = db.all_checkins
toronto_businesses = db.toronto_businesses
toronto_businesses_tips = db.toronto_businesses_tips
toronto_businesses_checkins = db.toronto_businesses_checkins
toronto_business_summary = db.toronto_business_summary
toronto_biz_cat_summary = db.toronto_biz_cat_summary
las_vegas_businesses = db.las_vegas_businesses
las_vegas_businesses_tips = db.las_vegas_businesses_tips
las_vegas_businesses_checkins = db.las_vegas_businesses_checkins
las_vegas_business_summary = db.las_vegas_business_summary
las_vegas_biz_cat_summary = db.las_vegas_biz_cat_summary
phoenix_businesses = db.phoenix_businesses
phoenix_businesses_tips = db.phoenix_businesses_tips
phoenix_businesses_checkins = db.phoenix_businesses_checkins
phoenix_business_summary = db.phoenix_business_summary
phoenix_biz_cat_summary = db.phoenix_biz_cat_summary

# Function that takes a Yelp JSON data file and loads it into a MongoDB collection
def load_data_to_mongo(yelp_dataset_path, collection, dataset_name):

    # Get the count of documents in the collection
    documents_count = collection.count_documents({})

    # Proceed to loading the JSON file to Mongo only if no documents exist in the collection  
    if (documents_count == 0):
        # Load the JSON file
        with open(yelp_dataset_path) as json_file:
            yelp_json = json.load(json_file)

        # Insert new documents into the collection
        print(f"Inserting new documents into the '{dataset_name}' collection in MongoDB, hang tight...")
        collection.insert_many(yelp_json)
        documents_count = collection.count_documents({})
        print(f"{documents_count} documents inserted!\n")
    else:
        print(f"Found the '{dataset_name}' collection in MongoDB with {documents_count} documents.")

# --------------------
# Toronto Data Load
# --------------------
# Load the Toronto Business JSON dataset
yelp_dataset_path = "static/assets/data/yelp_toronto_business_dataset_records.json"
load_data_to_mongo(yelp_dataset_path, toronto_businesses, "toronto_businesses")

# Load the merged JSON dataset containing Toronto Businesses & Checkins
yelp_dataset_path = "static/assets/data/yelp_toronto_checkin_business_dataset_records.json"
load_data_to_mongo(yelp_dataset_path, toronto_businesses_checkins, "toronto_businesses_checkins")

# Load the merged JSON dataset containing Toronto Businesses & Tips
yelp_dataset_path = "static/assets/data/yelp_toronto_tips_business_dataset_records.json"
load_data_to_mongo(yelp_dataset_path, toronto_businesses_tips, "toronto_businesses_tips")

# Load the Toronto Business Summary JSON dataset
yelp_dataset_path = "static/assets/data/yelp_toronto_business_summary_records.json"
load_data_to_mongo(yelp_dataset_path, toronto_business_summary, "toronto_business_summary")

# Load the Toronto Businesses-Categories Summary JSON dataset
yelp_dataset_path = "static/assets/data/yelp_toronto_biz_cat_summary_records.json"
load_data_to_mongo(yelp_dataset_path, toronto_biz_cat_summary, "toronto_biz_cat_summary")

# --------------------
# Las Vegas Data Load
# --------------------
# Load the Las Vegas Business JSON dataset
yelp_dataset_path = "static/assets/data/yelp_las_vegas_business_dataset_records.json"
load_data_to_mongo(yelp_dataset_path, las_vegas_businesses, "las_vegas_businesses")

# Load the merged JSON dataset containing Las Vegas Businesses & Checkins
yelp_dataset_path = "static/assets/data/yelp_las_vegas_checkin_business_dataset_records.json"
load_data_to_mongo(yelp_dataset_path, las_vegas_businesses_checkins, "las_vegas_businesses_checkins")

# Load the merged JSON dataset containing Las Vegas Businesses & Tips
yelp_dataset_path = "static/assets/data/yelp_las_vegas_tips_business_dataset_records.json"
load_data_to_mongo(yelp_dataset_path, las_vegas_businesses_tips, "las_vegas_businesses_tips")

# Load the Las Vegas Business Summary JSON dataset
yelp_dataset_path = "static/assets/data/yelp_las_vegas_business_summary_records.json"
load_data_to_mongo(yelp_dataset_path, las_vegas_business_summary, "las_vegas_business_summary")

# Load the Las Vegas Businesses-Categories Summary JSON dataset
yelp_dataset_path = "static/assets/data/yelp_las_vegas_biz_cat_summary_records.json"
load_data_to_mongo(yelp_dataset_path, las_vegas_biz_cat_summary, "las_vegas_biz_cat_summary")

# --------------------
# Phoenix Data Load
# --------------------
# Load the Las Vegas Business JSON dataset
yelp_dataset_path = "static/assets/data/yelp_phoenix_business_dataset_records.json"
load_data_to_mongo(yelp_dataset_path, phoenix_businesses, "phoenix_businesses")

# Load the merged JSON dataset containing Las Vegas Businesses & Checkins
yelp_dataset_path = "static/assets/data/yelp_phoenix_checkin_business_dataset_records.json"
load_data_to_mongo(yelp_dataset_path, phoenix_businesses_checkins, "phoenix_businesses_checkins")

# Load the merged JSON dataset containing Las Vegas Businesses & Tips
yelp_dataset_path = "static/assets/data/yelp_phoenix_tips_business_dataset_records.json"
load_data_to_mongo(yelp_dataset_path, phoenix_businesses_tips, "phoenix_businesses_tips")

# Load the Las Vegas Business Summary JSON dataset
yelp_dataset_path = "static/assets/data/yelp_phoenix_business_summary_records.json"
load_data_to_mongo(yelp_dataset_path, phoenix_business_summary, "phoenix_business_summary")

# Load the Las Vegas Businesses-Categories Summary JSON dataset
yelp_dataset_path = "static/assets/data/yelp_phoenix_biz_cat_summary_records.json"
load_data_to_mongo(yelp_dataset_path, phoenix_biz_cat_summary, "phoenix_biz_cat_summary")

# --------------------
# Full Data Load
# --------------------
# Load the full Business JSON dataset for all cities
yelp_dataset_path = "static/assets/data/yelp_converted_business_dataset_records.json"
load_data_to_mongo(yelp_dataset_path, all_businesses, "all_businesses")

# Load the full Checkin JSON dataset for all businesses
yelp_dataset_path = "static/assets/data/yelp_converted_checkin_dataset_records.json"
load_data_to_mongo(yelp_dataset_path, all_checkins, "all_checkins")

# Load the full Tips JSON dataset for all businesses
yelp_dataset_path = "static/assets/data/yelp_converted_tips_dataset_records.json"
load_data_to_mongo(yelp_dataset_path, all_tips, "all_tips")