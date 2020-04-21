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

# Function that takes a Yelp JSON data file and loads it into a MongoDB collection
def load_data_to_mongo(yelp_dataset_path, collection, dataset_name):
    # Load the JSON file
    with open(yelp_dataset_path) as json_file:
        yelp_json = json.load(json_file)

    # Delete all existing documents from the collection
    print(f"Deleting documents from the '{dataset_name}' collection in MongoDB, hang tight...")
    deleted_documents = collection.delete_many({})
    print(f"Found and Deleted {deleted_documents.deleted_count} documents!")

    # Insert new documents into the collection
    print(f"Inserting new documents into the '{dataset_name}' collection in MongoDB, hang tight...")
    collection.insert_many(yelp_json)
    print(f"{collection.count_documents({})} documents inserted!\n")

# Load the Toronto Business JSON dataset
yelp_dataset_path = "static/assets/data/yelp_toronto_business_dataset_records.json"
load_data_to_mongo(yelp_dataset_path, toronto_businesses, "toronto_businesses")

# Load the merged JSON dataset containing Toronto Businesses & Checkins
yelp_dataset_path = "static/assets/data/yelp_toronto_checkin_business_dataset_records.json"
load_data_to_mongo(yelp_dataset_path, toronto_businesses_checkins, "toronto_businesses_checkins")

# Load the merged JSON dataset containing Toronto Businesses & Tips
yelp_dataset_path = "static/assets/data/yelp_toronto_tips_business_dataset_records.json"
load_data_to_mongo(yelp_dataset_path, toronto_businesses_tips, "toronto_businesses_tips")

# Load the full Business JSON dataset for all cities
yelp_dataset_path = "static/assets/data/yelp_converted_business_dataset_records.json"
load_data_to_mongo(yelp_dataset_path, all_businesses, "all_businesses")

# Load the full Checkin JSON dataset for all businesses
yelp_dataset_path = "static/assets/data/yelp_converted_checkin_dataset_records.json"
load_data_to_mongo(yelp_dataset_path, all_checkins, "all_checkins")

# Load the full Tips JSON dataset for all businesses
yelp_dataset_path = "static/assets/data/yelp_converted_tips_dataset_records.json"
load_data_to_mongo(yelp_dataset_path, all_tips, "all_tips")