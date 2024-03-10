**The problem CashKick solves**

Personal finance is amongst the most important concepts that one must learn, and yet it is a consistently neglected topic amongst teenagers. Nearly, 80% of all teenagers don’t feel confident about their financial literacy.

Enter CashKick! We take advantage of the remarkable parallels between FIFA Ultimate Team, one of the most popular video games in the world, and the stock market.

We have created a trading platform based on FIFA’s virtual economy. With a starting budget, users can buy and sell cards based on FUT market prices, aim to increase their portfolio value, and compete in leagues with their friends.

Much like stocks in real life, player prices in FIFA are determined by a multitude of factors, including their real-life performance, in-game supply & demand forces, and market sentiment.

Our app takes these parallels and makes them educational. We incorporate real-time data, sentiment analysis from social media, and a sophisticated evaluation algorithm to teach users about market analysis, investment strategy, and the financial implications of their trade decisions. By engaging with our trading platform, users learn to apply these concepts in a fun and interactive way, gaining practical financial literacy skills that are applicable in real-life financial markets.

Ultimately, we introduce teenagers to the fundamentals of financial markets through a medium they are already passionate about.

**Challenges we ran into**

The primary challenge is coming up with a suitable idea for the entire team to work on. This idea had to be relevant and applicable to the real world, primarily data-science driven, as well as engaging enough for all team members.
The novelty of the idea led to a lack of databases to train models on. This left us with the task of data-engineering, causing us to scrape appropriate real time player price data, historical price data and relevant tweets for each player.
Since the solution aims to increase financial literacy, users decisions had to be evaluated and given feedback in real time, and hence needed a model for evaluating and ranking all possible trades immediately.
Stock market is heavily influenced by external factors, needing users to be given a taste of the same on our platform. Resulting in the need for a model for sentiment analysis on the tweets which provides easily understandable external data for application by the user.
Since a major attraction to the app is the Fifa video game, adding authenticity and relatability to our product was crucial. The decision to generate card visualizations resembling Fifa cards posed to be an incredible challenge.
All player data needed to be stored in multiple databases for easy and instant access. Using the unique structure and properties of MongoDB Atlas for the first time presented itself as an unexpected challenge.
Discussion
