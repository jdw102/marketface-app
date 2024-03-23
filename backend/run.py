from flask import Flask
from app.routes.api_routes import api_app

app = Flask(__name__)

app.register_blueprint(api_app)

@app.route('/')
def hello():
    return 'Hello, World!'

if __name__ == '__main__':
    app.run(debug=True)