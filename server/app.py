from flask import Flask
from flask_migrate import Migrate
from flask_cors import CORS
from models import db

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///salespilot.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False




db.init_app(app)
migrate = Migrate(app, db)
CORS(app)


@app.route('/')
def index():
    return "Welcome to SalesPilot API!"

if __name__ == '__main__':
    app.run(debug=True, port=5555)
