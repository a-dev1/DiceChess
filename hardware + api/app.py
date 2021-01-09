from flask import Flask, jsonify
from flask_cors import CORS
from servo import Rotate

app = Flask(__name__)
CORS(app)

@app.route('/roll')
def roll():
    Rotate(180)
    Rotate(0)
    Rotate(180)
    Rotate(0)
    return jsonify({'Status':'Dice rolled'})


    
if __name__ == '__main__':
    app.run(debug=True)
