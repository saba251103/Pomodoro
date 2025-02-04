from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})  # Allow CORS for all origins

events = []  # In-memory event storage (use a database in production)

@app.route('/eventdetails', methods=['POST', 'GET'])
def add_event():
    if request.method == 'POST':
        data = request.get_json()
        if not data:
            return jsonify({"error": "Invalid JSON"}), 400
        
        events.append(data)  # Store event in memory
        return jsonify({"message": "Event received", "event": data}), 201

    elif request.method == 'GET':
        return jsonify({"events": events}), 200  # Return stored events

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
