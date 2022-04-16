import pandas as pd
import csv
import datetime
import numpy as np
from smtplib import SMTP
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from pretty_html_table import build_table

df = pd.read_csv('data/scrape.csv')

today = datetime.date.today().strftime("%Y-%m-%d")
lowPrices = []
dates = []

for x in range(len(df)):
    if df['currentPrice'][x] < df['regularPrice'][x]:
        lowPrices.append(df['currentPrice'][x])
        dates.append(today)
    else:
        lowPrices.append(df['regularPrice'][x])
        dates.append(today)
df.insert(5, 'lowPrice', lowPrices)
df['latestCheck']=dates

items_all_df = pd.read_csv('data/itemsAll.csv')

join_columns = ['brandName', 'itemName', 'itemColor']

merge_df = pd.merge(df, items_all_df, on=join_columns, how='outer', suffixes=('', '_y')).drop(['inStock_y', 'url_y'], axis=1).fillna({'lowestPrice': 10000, 'lowPriceDate': today})
merge_df['bestPrice'] = np.where((merge_df['lowPrice'] < merge_df['lowestPrice']), merge_df['lowPrice'], merge_df['lowestPrice'])
merge_df['bestPriceDate'] = np.where((merge_df['lowPrice'] < merge_df['lowestPrice']), merge_df['latestCheck'], merge_df['lowPriceDate'])

new_items_all_df = merge_df.drop(['currentPrice', 'regularPrice', 'lowPrice', 'latestCheck', 'lowestPrice', 'lowPriceDate'], axis=1).rename(columns = {'bestPrice': 'lowestPrice', 'bestPriceDate': 'lowPriceDate'})
new_items_all_df = new_items_all_df[['brandName', 'itemName', 'itemColor', 'lowestPrice', 'lowPriceDate', 'inStock', 'url']]
new_items_all_df.to_csv('data/itemsAll.csv', index=False)

calc_df = merge_df.drop(['lowPrice', 'latestCheck', 'lowestPrice', 'lowPriceDate'], axis=1)
calc_df['currentPercentOff'] = ((1 - calc_df['currentPrice']/calc_df['regularPrice']) * 100).astype(int)
calc_df['bestPercentOff'] = ((1 - calc_df['bestPrice']/calc_df['regularPrice']) * 100).astype(int)
calc_df['myCurrentPrice'] = (calc_df['currentPrice'] * 0.9).round(2)
calc_df['myBestPrice'] = (calc_df['bestPrice'] * 0.9).round(2)
calc_df['myCurrentPercentOff'] = ((1 - calc_df['myCurrentPrice']/calc_df['regularPrice']) * 100).astype(int)
calc_df['myBestPercentOff'] = ((1 - calc_df['myBestPrice']/calc_df['regularPrice']) * 100).astype(int)
urls = calc_df.pop('url')
calc_df.insert(len(calc_df.columns), 'url', urls)

filtered_df = calc_df.loc[calc_df['inStock'] == 'y'].reset_index(drop=True).drop(['inStock'], axis=1)

def send_mail(body):

    message = MIMEMultipart()
    message['Subject'] = f'Huckberry price check for {today}'
    message['From'] = '<sender>@gmail.com'
    message['To'] = '<receiver>@gmail.com'

    body_content = body
    message.attach(MIMEText(body_content, "html"))
    msg_body = message.as_string()

    server = SMTP('smtp.gmail.com', 587)
    server.starttls()
    server.login(message['From'], 'your_password_here')
    server.sendmail(message['From'], message['To'], msg_body)
    server.quit()
    
send_mail(build_table(filtered_df, 'green_dark'))