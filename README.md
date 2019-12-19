# Mongo Scraper: PBS Frontline Edition

## Application Overview: 
Mongo Scraper is a site that scrapes the PBS Frontline website for articles and gives users functionailty to save/delete articles and add/delete notes.

## Utility:  
Mongo Scraper is a full stack app that is useful for storing interesting articles from PBS Frontline's site and adding/deleting multiple notes.

## Instructions for Home Page:  
### 1. Click on the "Scrape" button in the Nav Bar to scrape PBS's Website (this may take several seconds)
### 2. Click on the "Save" button next to a specific article to save the specific article that can be viewed later
### 3. Click on the "View" button next to a specific article to go to PBS's website and read it 
### 3. Click on the "Clear Articles" button in the Nav Bar to delete all of the scraped articles from the DOM and database
### 4. Click on the "View Saved Articles" link in the Nav Bar to go to the Saved articles page

## Instructions for Saved Articles Page:
### 1. Click on the "Delete" button next to a specific article to delete it from your saved database
### 2. Click on the "View" button next to a specific article to view the article on PBS's website
### 3. Click on the "Add Note" button next to a specific article to view the modal of current notes/ add note / delete note

# Technologies Deployed: 
  1. node.js (platform for executing JavaScript code server-side)
  2. npm "express" - handles routing
  3. npm "path" - the path.dirname() method returns the directory name of a path
  4. heroku - used as a host to deploy the app with git so the app can be accessed from a website link.
  5. axios - to grab JSON data from PBS's website
  6. cheerio - scrapes the data   
  7. mongoose - to simplify Mongo DB calls
  8. morgan" - HTTP request logger middleware for node.js

# Click on this Link to access the mongoScraper website:  https://sheltered-coast-86283.herokuapp.com/index.html

### Created by: Jamie O'Neill