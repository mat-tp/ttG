# app.py
from flask import Flask, render_template, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///visitors.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

class Visitor(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    rank = db.Column(db.String(50), default='Timeline Initiate')
    visits = db.Column(db.Integer, default=1)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'timestamp': self.timestamp.isoformat(),
            'rank': self.rank,
            'visits': self.visits
        }

with app.app_context():
    db.create_all()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/visitors', methods=['GET'])
def get_visitors():
    visitors = Visitor.query.order_by(Visitor.timestamp.desc()).all()
    return jsonify([visitor.to_dict() for visitor in visitors])

@app.route('/api/visitors', methods=['POST'])
def add_visitor():
    data = request.json
    visitor = Visitor(name=data['name'])
    db.session.add(visitor)
    db.session.commit()
    return jsonify(visitor.to_dict())

if __name__ == '__main__':
    app.run(debug=True)