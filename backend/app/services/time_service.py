from datetime import datetime, timedelta
from dateutil.relativedelta import relativedelta


def get_date():
    current_date = datetime.now()
    with open('difference.txt', 'r') as file:
        difference = file.read()
    if difference:
        difference = timedelta(seconds=float(difference))
        current_date = current_date - difference
    return current_date