
# Barista


## Technology Used 

| Technology Used (API & Framework)         | Resource URL           | 
| ------------- |:-------------:| 
| Microsoft Bing Map API    | [https://learn.microsoft.com/en-us/bingmaps/rest-services/](https://learn.microsoft.com/en-us/bingmaps/rest-services/) | 
| OpenWeather API     | [https://openweathermap.org/current](https://openweathermap.org/current)      |   
| SoundCloud Widget API | [https://developers.soundcloud.com/docs/api/html5-widget](https://developers.soundcloud.com/docs/api/html5-widget)     |
Bulma Framework   | [https://bulma.io/documentation/](https://bulma.io/documentation/)    

## Description 

[Visit the Deployed Site](https://jonnyboy808.github.io/barista/)

The Barista webapp dynamically generates all your cafe searching needs based on user input. On initial page load the user's current city is displayed in the map produced by Bing™. This webapp will display a list of the names and addresss of cafes when a user inputs a city of their choice within the seach box. The user is also greeted by music that auto plays when the page loads and also plays the next song on the playlist to set the mood when searching for their next cafe. Additionally if the user chooses, they may pause and resume the music as they wish. The weather of the inputed searched city is also displayed above the map to make for a better convinence before the user decides to head out to their new chosen cafe.



## Table of Contents

* [Code Example](#code-example)
* [Usage](#usage)
* [Learning Points](#learning-points)
* [Author Info](#author-info)
* [Credits](#credits)
* [License](#license)


## Code Example



```html
<div class="header">
        <h1>Hori<span class="seo">seo</span>n</h1>
        <div>
            <ul>
                <li>
                    <a href="#search-engine-optimization">Search Engine Optimization</a>
                </li>
                <li>
                    <a href="#online-reputation-management">Online Reputation Management</a>
                </li>
                <li>
                    <a href="#social-media-marketing">Social Media Marketing</a>
                </li>
            </ul>
        </div>
    </div>
```

Converting the above non-semantic div with the class of 'header' to an appropriate [<header> semantic element](https://www.w3schools.com/html/html5_semantic_elements.asp). 

```html
<header>
        <h1>Hori<span class="seo">seo</span>n</h1>
        <nav>
            <ul>
                <li>
                    <a href="#search-engine-optimization">Search Engine Optimization</a>
                </li>
                <li>
                    <a href="#online-reputation-management">Online Reputation Management</a>
                </li>
                <li>
                    <a href="#social-media-marketing">Social Media Marketing</a>
                </li>
            </ul>
        </nav>
    </header>

```

This change require some additional modification to the CSS selector: 

```css
.header {
    padding: 20px;
    font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
    background-color: #2a607c;
    color: #ffffff;
}
```

No longer targeting the element on the page with the class of 'header' but instead the css selector targeting the 'header' element 

```css
header {
    padding: 20px;
    font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
    background-color: #2a607c;
    color: #ffffff;
}

```

## Usage 

Once the deployed site link is clicked, the user can start their search for a new cafe using the search box by entering the city and state of their choosing. The page will dynamically update and display coffee shops of the inputed city, generating the name and adresses in a scroll list. That same search will also produce the current weather conditions of the city with no need to make an additional request.

(add screenshot of webpage)

The webapp also auto plays music when the page is initially loaded and will continue to play following a set library playlist provided by SoundCloud®. The user can also control the music should they wish to pause or continue playing the sound.
(add screenshot of soundcloud widget)

Lastly on initial page load, the user's city is automatically displayed in the map, with no need for the user to manually set their city.
(add screenshot of map example)

```md
![alt text](assets/images/screenshot.png)
```


## Learning Points 


This is a good place to Explain what you Learned by creating this application.
This is a great way to remind about all of the Complex Skills you now have.
If the user is less experienced than you:
They will be impressed by what you can do!

If the user is more experienced than you:
They will be impressed by what you can do!

Remember, it is easy to forget exactly how Valuable and Impressive your skills are, as well as How Much You’ve Learned!
So quantify that here!


## Author Info

## Credits

An amazing amout of credit is due to the wonderful team that help bring this webpage to life
Below is each contributors account/s.

```md
- Cassandra: [Github](https://github.com/CTep09)
- Jonathan: [Github](https://github.com/jonnyboy808/)
- Bahareh: [Github](https://github.com/Bhmerir)
- Suchaya: [Github](https://github.com/osuchaya)
```


## License

The last section of a good README is a license. This lets other developers know what they can and cannot do with your project. If you need help choosing a license, use [https://choosealicense.com/](https://choosealicense.com/)


---



## Features

If your project has a lot of features, consider adding a heading called "Features" and listing them there.



---

© 2023 Confidential and Proprietary. All Rights Reserved.
