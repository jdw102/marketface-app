import pandas as pd
from datetime import datetime
from app.db import get_analyst_ratings

def is_first_date_smaller(date_str1, date_str2):
    """
    Compares two dates given in string format ("mm/dd/yy") and returns True if the first date is smaller
    than the second without using the datetime module.

    Args:
    date_str1 (str): The first date string.
    date_str2 (str): The second date string.

    Returns:
    bool: True if the first date is earlier than the second, False otherwise.
    """
    # Split each date string into [month, day, year]
    month1, day1, year1 = map(int, date_str1.split('/'))
    month2, day2, year2 = map(int, date_str2.split('/'))

    # Convert two-digit year to four digits (assuming 2000s)
    year1 += 2000 if year1 < 100 else 0
    year2 += 2000 if year2 < 100 else 0

    # Compare year, then month, then day
    if year1 < year2:
        return True
    elif year1 > year2:
        return False
    else:  # year1 == year2
        if month1 < month2:
            return True
        elif month1 > month2:
            return False
        else:  # month1 == month2
            return day1 < day2


def read(name):
    a = get_analyst_ratings(name)
    a.drop(columns=['_id', 'stock'], inplace=True)
    try:
        a = a.drop(columns = [3, 4])
    except:
        pass
    retDict = {}
    optionSet = set()
    for i in a.itertuples():
        #print(i[1])
        try:
            rater = i[2].split(':')[0]
            rating = i[1]
            date = i[3]
            raw_rating = i[2].split(':')[1]
            optionSet.add(rating)
            retDict[rater] = retDict.get(rater,[])
            pred_rating = None
            if ('Buy' in raw_rating or 'Overweight' in raw_rating or 'Outperform' in raw_rating or 'Positive' in raw_rating):
                pred_rating = 'Buy'
            elif ('Neutral' in raw_rating or 'Hold' in raw_rating or 'Perform' in raw_rating or 'Equal' in raw_rating or 'Sector' in raw_rating or 'In-Line'):
                pred_rating = 'Neutral'
            elif ('Negative' in raw_rating or 'Sell' in raw_rating or 'Under' in raw_rating or 'Reduce' in raw_rating):
                pred_rating = 'Sell'
            else:
                print(raw_rating)
            retDict[rater].append([rating, date, i[2].split(':')[1], pred_rating])

        except:
            continue


    #print(retDict['Citigroup'])
    #print(optionSet)
    return retDict

def construct_statistics(company_dict, date):
    summaryRatings = []
    for rater in company_dict.keys():
        latestRating = None
        for rating in company_dict[rater]:
            if (is_first_date_smaller(rating[1], date)): #then this is the latest rating before the given date
                latestRating = rating
                summaryRatings.append(latestRating[3])
                break
    #print(summaryRatings)
    return summaryRatings

def get_stats(name, date):
    dict = read(name)
    sumStats = construct_statistics(dict, date)
    count = len(sumStats)
    buys = sumStats.count('Buy')
    neutral = sumStats.count('Neutral')
    sell = sumStats.count('Sell')

    return count, buys, neutral, sell

# if __name__ == '__main__':
#     ls = ['TSLA','AAPL','META', 'NVDA', 'AMZN' ]
#     for i in ls:
#         count, buys, neutral, sell = get_stats(i, '1/20/20')
#         print(f"There were {count} ratings, {buys} buy ratings, {neutral} neutral ratings, and {sell} sell ratings.")