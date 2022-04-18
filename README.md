# Cap It All
Cap It All is a price tracker for items on the Huckberry online store. It scrapes data about the items included in a list of URLs and transforms that data into an HTML table in an email message that can be used primarily to keep up with price changes.

Theoretically, this code can be adapted to scrape from any online retailer, but the fact that I use Cypress to scrape the data might limit the scraper's effectiveness and utility (also read as: I used Cypress, a testing framework, experimentally and not in a way it's intended to be used).

## How it works
A Cypress script scrapes data for each item in the `urlsList.js` module and saves the data to the `scrape.csv`. Once the scrape is done, the Python script in `cap_it_all.py` uses the `pandas` library to transform the `scrape.csv` data, compare it to what exists (or doesn't exist) in `itemsAll.csv`, update `itemsAll.csv`, and calculate trends in the current price of the scraped items. Those trends are then converted to HTML with the `pretty_html_table` package and sent in an email by using the `smtplib` module.

All credit for the `send_mail()` function and idea to use `pretty_html_table` and `smtplib` goes to Siddhesh Shankar, who detailed how to do it all [here](https://dev.to/siddheshshankar/convert-a-dataframe-into-a-pretty-html-table-and-send-it-over-email-4663).

## License
Copyright © 2022 Marshall Doig. This project is licensed as [MIT](https://mit-license.org/).