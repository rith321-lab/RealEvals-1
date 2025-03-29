import json
import random
import os

os.makedirs("data", exist_ok=True)

websites = [
    'amazon', 'ebay', 'walmart', 'target', 'bestbuy', 'homedepot', 'lowes', 
    'costco', 'samsclub', 'wayfair', 'etsy', 'newegg', 'overstock', 'zappos', 
    'macys', 'nordstrom', 'gap', 'oldnavy', 'nike', 'adidas', 'apple', 
    'microsoft', 'dell', 'hp', 'lenovo', 'samsung', 'lg', 'sony', 'panasonic', 
    'bose', 'jbl', 'beats', 'airbnb', 'booking', 'expedia', 'hotels', 
    'tripadvisor', 'yelp', 'grubhub', 'doordash', 'ubereats', 'instacart', 
    'kroger', 'safeway', 'wholefoods', 'traderjoes', 'cvs', 'walgreens', 
    'riteaid', 'ikea', 'gamestop', 'steam', 'epicgames', 'playstation', 
    'xbox', 'nintendo', 'ea', 'ubisoft', 'activision', 'blizzard', 'riot', 
    'valve', 'twitch', 'youtube', 'netflix', 'hulu', 'disneyplus', 'hbomax', 
    'peacock', 'paramount', 'spotify', 'pandora', 'applemusic', 'tidal', 
    'soundcloud', 'bandcamp', 'facebook', 'instagram', 'twitter', 'linkedin', 
    'pinterest', 'reddit', 'tumblr', 'quora', 'medium', 'wordpress', 'blogger', 
    'wix', 'squarespace', 'shopify', 'google', 'bing', 'yahoo', 'duckduckgo', 
    'gmail', 'outlook', 'protonmail', 'zoho', 'aol', 'icloud', 'office365', 
    'gsuite', 'dropbox', 'googledrive', 'onedrive', 'box', 'mega', 'mediafire', 
    'wetransfer', 'sendspace', 'zippyshare', 'vimeo', 'dailymotion'
]

instructions = [
    'Find a product with at least 4-star rating and free shipping',
    'Search for the cheapest flight from New York to London next month',
    'Book a hotel room for two adults for next weekend',
    'Find a restaurant with vegetarian options and good reviews',
    'Order a medium pizza with pepperoni for delivery',
    'Find the nearest pharmacy that is open 24 hours',
    'Search for a used car under $10,000 within 50 miles',
    'Find a job opening for software engineer in San Francisco',
    'Search for a 2-bedroom apartment for rent under $2000',
    'Find a doctor who accepts Medicare and has availability next week',
    'Check the weather forecast for the next 5 days',
    'Find the nearest gas station with the lowest price',
    'Search for a movie playing tonight at a theater nearby',
    'Find a recipe for chocolate chip cookies with easy ingredients',
    'Search for a plumber with good reviews who can come tomorrow',
    'Find a gym with a free trial membership nearby',
    'Search for a laptop under $1000 with at least 16GB RAM',
    'Find a dog walker available on weekdays',
    'Search for a dentist who specializes in pediatric care',
    'Find a hair salon with availability this weekend',
    'Search for a tax preparer with good reviews',
    'Find a moving company available next month',
    'Search for a tutor for high school math',
    'Find a cleaning service with availability this week',
    'Search for a lawyer who specializes in immigration',
    'Find a veterinarian who can see a cat tomorrow',
    'Search for a photographer for a wedding next year',
    'Find a landscaper who can mow a lawn weekly',
    'Search for an electrician who can fix a ceiling fan',
    'Find a painter who can paint a bedroom next week',
    'Compare prices for a specific product across different retailers',
    'Find the best-rated Italian restaurant in the area',
    'Book a flight with specific seat preferences',
    'Find a hotel with a swimming pool and free breakfast',
    'Order groceries for delivery tomorrow morning',
    'Find a nearby coffee shop with free WiFi',
    'Search for concert tickets for a specific artist',
    'Find a gym that offers yoga classes',
    'Search for a specific book in hardcover format',
    'Find a dentist who accepts your insurance plan',
    'Check the status of a recent order',
    'Find a nearby park with hiking trails',
    'Search for a specific movie to stream online',
    'Find a recipe for a gluten-free dessert',
    'Search for a plumber available for emergency service',
    'Find a fitness class scheduled for this weekend',
    'Search for a smartphone with specific features under $500',
    'Find a pet sitter with availability next week',
    'Search for an orthodontist who specializes in adult braces',
    'Find a spa with couples massage availability'
]

tasks = []
for i in range(1, 1001):
    task_id = f'{i}.0'
    website = random.choice(websites)
    instruction = random.choice(instructions)
    url = f'https://www.{website}.com'
    
    task = {
        'task_id': task_id,
        'website': website,
        'instruction': instruction,
        'url': url
    }
    tasks.append(task)

with open('data/mind2web.jsonl', 'w') as f:
    json.dump(tasks, f, indent=2)

print(f"Generated 1000 synthetic Mind2Web tasks and saved to data/mind2web.jsonl")
print(f"First 3 tasks:")
for task in tasks[:3]:
    print(f"Task {task['task_id']}: {task['instruction']} on {task['website']}")
