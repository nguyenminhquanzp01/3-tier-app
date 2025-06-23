from flask import Flask, jsonify
from flask_cors import CORS
from pymongo import MongoClient
import os

app = Flask(__name__)
CORS(app)

client = MongoClient("mongodb://mongo:27017/")
db = client["course"]
collection = db["attendees"]

@app.route("/api/attendees")
def get_attendees():
    attendees = list(collection.find({}, {"_id": 0}))
    print("Hello")
    return jsonify(attendees)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
