import json
import os
import pymongo

# Setup connection to mongodb
conn = "mongodb://localhost:27017"
client = pymongo.MongoClient(conn)

# Select database and collection to use
db = client.yelp_dataset
businesses = db.businesses
tips = db.tips

# Path to Yelp's Business JSON Dataset file
yelp_business_dataset_path = "assets/data/yelp_converted_business_dataset_records.json"

# Load the Business JSON file
with open(yelp_business_dataset_path) as json_business_file:
    yelp_business_json = json.load(json_business_file)

# Delete all existing business documents/rows from the DB
print("Deleting all existing Yelp Business data from Mongo...Hang Tight!")
deleted_businesses = db.businesses.delete_many({})
print(f"Deleted {deleted_businesses.deleted_count} documents from Mongo!")

# Insert a fresh set of business documents/rows to the DB
print("Loading a fresh Yelp Business Dataset to Mongo...Hang Tight!")
new_businesses = db.businesses.insert_many(yelp_business_json)
print(f"All Yelp Business Data has been Uploaded: {db.businesses.count_documents({})}")

# Path to Yelp's Tips JSON Dataset file
yelp_tips_dataset_path = "assets/data/yelp_converted_tips_dataset_records.json"

# Load the Tips JSON file
with open(yelp_tips_dataset_path) as json_tips_file:
    yelp_tips_json = json.load(json_tips_file)

# Delete all existing tips documents/rows from the DB
print("Deleting all existing Yelp Tips data from Mongo...Hang Tight!")
deleted_tips = db.tips.delete_many({})
print(f"Deleted {deleted_tips.deleted_count} documents from Mongo!")

# Insert a fresh set of tips documents/rows to the DB
print("Loading a fresh Yelp Tips Dataset to Mongo...Hang Tight!")
new_tips = db.tips.insert_many(yelp_tips_json)
print(f"All Yelp Tips Data has been Uploaded: {db.tips.count_documents({})}")