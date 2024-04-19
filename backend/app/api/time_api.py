from datetime import datetime, timedelta
from flask import request, Blueprint, jsonify

time_api = Blueprint('time_api', __name__)


@time_api.route('/update_date', methods=['POST'])
def calculate_difference():
    data = request.json
    past_date = data.get('past_date')
    past_date = datetime.strptime(past_date, '%Y-%m-%dT%H:%M:%S.%fZ')
    past_date -= timedelta(hours=4)
    current_date = datetime.now()
    difference = current_date - past_date
    with open('difference.txt', 'w') as file:
        file.write(str(difference.total_seconds()))
    return 'Difference calculated and saved in difference.txt'


@time_api.route('/get_date', methods=['GET'])
def get_date():
    current_date = datetime.now()
    with open('difference.txt', 'r') as file:
        difference = file.read()
    if difference:
        difference = timedelta(seconds=float(difference))
        current_date = current_date - difference
    ret = current_date.strftime('%Y-%m-%d %H:%M:%S')
    return jsonify({'date': ret})