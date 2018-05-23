# pubcrawlers mock app

Rails app generated with [lewagon/rails-templates](https://github.com/lewagon/rails-templates), created by the [Le Wagon coding bootcamp](https://www.lewagon.com) team.

This app is intended to showcase the implementation of some of the most common features used by Le Wagon students in their projects using webpacker and ES6 syntax as opposed to jQuery and the Asset Pipeline as recommended by the course curriculum.

It is not meant to be the end-all implementation solution for these features, but merely to be used as a reference tool, namely by the Le Wagon Lisbon teaching staff and alumni.

Live demo here https://pubcrawlerapp.herokuapp.com/

## Table of Contents

* [Getting started](#getting-started)
* [Structuring the packs files](#structuring-the-packs-files)
* [Webpack and the Asset Pipeline](#webpack-and-the-rails-asset-piepeline)
* [Common patterns](#common-patterns)
* [Deploying to Heroku](#deploying-to-heroku)
* [Adding a Datepicker](#adding-a-datepicker)
* [Adding Google Maps](#adding-google-maps)
* [Adding Mapbox](#adding-mapbox)
* [Adding a Favoriting System](#adding-a-favoriting-system)
* [Setting up Devise for AJAX requests](#setting-up-devise-for-ajax-requests)

## Getting started

After cloning the app, create the db, run the migrations and seed.

```bash
$ rails db:create db:migrate db:seed
```

The seeds include addresses that will be geocoded. In order to take advantage of all of the features, make sure that all of the addresses were properly geocoded.

You can use an API key for [Google's Maps Geocoding API](https://console.developers.google.com)

```ruby
GOOGLE_API_SERVER_KEY: AIz*********************************TUZ
```

NOTE: Only `admin` users can create new instances of `Pub`.

## Structuring the packs files

The `app/javascript/packs/application.js`is webpack's javascript entry point. You should use it to require the components your application needs, both npm modules installed with `yarn` and your own local javascript components, which can go in their own folder in `app/javascript/components`.

Some npm modules require your to import their own css in order to work property. You should set up `application.js` to import a css file from where all modules' stylesheets will be imported:

```javascript
import './application.css';
```

and let rails know you'll be importing CSS from in your javascript by adding this to your `application.html.erb` layout:

```ruby
<%= stylesheet_pack_tag 'application', media: 'all' %>
```

Finally, you can import vendor css from the packs `application.css`

```css
@import 'name-of-vendor-npm-module/vendor.css';
```

## Webpack and the Rails Asset Piperline

If you need to access assets, such as images and other files, from the sprockets assets pipeline, you can configure webpack to look up files in that folder by adding the following to `webpacker.yml` config file under the *default:* key:

```ruby
resolved_paths: ['app/assets']
```

You can now import images from `app/assets/images` in a js file like this:

```javascript
import imageName from 'images/image.jpg';
```

imageName will now reference the relative path inside your app. If you need an absolute path you can do something like this:

```javascript
const myImage = window.location.origin + imageName;
```

## Common patterns

When you import modules in `packs/application.js` they will run on every page of your app that's linked to webpack's entry point with `<%= javascript_pack_tag 'application' %>`. Something this is what you want, but often you want certain pieces of your javascript code to run only on specific pages.

One way to deal with this is to call your modules conditionally. First you set up the `body` class in your layout file with two utility classes which will bear the current controller and action name:

```ruby
<body class="<%= controller_name %> <%= action_name %>">
  <%= yield %>
</body>
<% end >
```

Then you call your modules on the specific pages you want them to run. For example, I have a banner only displayed on my landing page and I want to transform some banner text content with javascript:

```javascript
import { activateNeonBannerText } from '../components/home';

const homePage = document.querySelector('.pages.home');
if (homePage) {
  activateNeonBannerText();
  ... // other modules/components
}
```

Another strategy is to put javascript that relies on the existence of a specific element inside an if block:

```javascript
const initMap = function() {
  const mapElement = document.getElementById('map');
  if (mapElement) {
    ... // only do something if #map element exists
  }
}
```

## Deploying to heroku

If deploying to heroku fails, it might be an issue with the webpacker version and you'll have to manually specify the heroku buildpacks:

```bash
$ heroku buildpacks:clear
$ heroku buildpacks:set heroku/nodejs
$ heroku buildpacks:add heroku/ruby
```

## Adding a Datepicker

There are many datepickers available, but many students end up trying to implement datepicker gems with outdated documentation or which require jQuery.

My personal preference goes for [flatpicker](https://flatpickr.js.org). It is very light, highly customizable, includes a timepicker and does not require students to add moment.js

Setting up is simple:

```bash
$ yarn add flatpicker
```

Then in the pack file responsible for importing css, in this case `app/javascript/packs/application.css`

```javascript
@import 'flatpickr/dist/flatpickr.css';
```

Flatpicker takes a DOM element as the first argument, and a javascript options object to configure flatpicker behaviour.

In this example I'm using a startDate input and an endDate input and the minimum date of the endDate input is defined by the selected date on the startDate input:

```javascript
import flatpickr from 'flatpickr';

const startDateinput = document.getElementById('crawl_start_date');
  const endDateinput = document.getElementById('crawl_end_date');

  if (startDateinput && endDateinput) {
    flatpickr(startDateinput, {
    minDate: 'today',
    dateFormat: 'd-m-Y',
    onChange: function(_, selectedDate) {
      if (selectedDate === '') {
        return endDateinput.disabled = true;
      }
      endDateCalendar.set('minDate', selectedDate);
      endDateinput.disabled = false;
    }
  });
    const endDateCalendar =
      flatpickr(endDateinput, {
        dateFormat: 'd-m-Y',
      });
  }
```

## Adding Google Maps

For the basic setup I recommend following Le Wagon's [geocoding lecture](https://kitt.lewagon.com/knowledge/lectures/05-Rails%2F08-Airbnb-Geocoder)

However, unlike the lecture setup, *map.js* is a component and should go in the `app/javacript/components/` folder.

You can pass several options when creating the map, such as to disable `streetViewControl`, `mapTypeControl`and `scrollwheel`:

```javascript
const map = new GMaps({
  el: '#map',
  lat: 0, lng: 0,
  streetViewControl: false,
  mapTypeControl: false,
  scrollwheel:  false
});
```

To highlight markers on hovering over their corresponding card, you need to add an event listener to each card and dynamically change the marker when the event is fired:

```javascript
const cards = document.querySelectorAll('.card-row');
cards.forEach((card, index) => {
  const marker = mapMarkers[index];
  card.addEventListener('mouseover', () => {
    marker.setIcon('https://raw.githubusercontent.com/Concept211/Google-Maps-Markers/master/images/marker_blue.png');
  });
  card.addEventListener('mouseout', () => {
    marker.setIcon('https://raw.githubusercontent.com/Concept211/Google-Maps-Markers/master/images/marker_red.png');
  });
})
```

To center map on clicked marker and open infoWindow:

```javascript
mapMarkers.forEach((marker, index) => {
  marker.addListener('click', () => {
    map.setCenter(markers[index]);
    markers[index].infoWindow.open(map, marker);
  })
})
```

To use a custom marker from your assets pipeline, simple link the image file to the key `icon` in the controller action that builds the markers hash:

```ruby
def index

  ...

  @markers = @pubs.map do |pub|
    {
      lat: pub.latitude,
      lng: pub.longitude,
      icon: view_context.image_path("map-marker-black.png"),
      infoWindow: { content: render_to_string(partial: "/pubs/map_box", locals: { pub: pub }) }
    }
  end
end
```

## Adding Mapbox

### Setting up the backend

In order to add dynamic markers, mapbox need to receive an array of features. Here's an example of how we can set this up in our controller:

```ruby
@features = @crawl.pubs.map do |pub|
        { "type": "Feature",
          "id": "#{pub.id}",
          "properties": {
            "description":
            "<div class=\"popup-bottom\">
            <h4 class=\"bold\">#{pub.name}</h4>
            <h5 class=\"light\">#{pub.district}</h5>
            </div>"
          },
          "geometry": {
              "type": "Point",
              "coordinates": [pub.longitude, pub.latitude]
          }
        }
  end
```

Then we pass these feartures to the frontend using the data atribute:

```html
<div
  id="map"
  class="search-map"
  data-features="<%= @features.to_json %>"
></div>
```

### Creating the map

Add the Mapbox GL javaScript library:

```bash
$ yarn add mapbox-gl
```

Import Mapbox GL css in `app/javascripts/packs/application.css`

```javascript
@import 'mapbox-gl/dist/mapbox-gl.css';
```

Because we are styling the map element in the asset pipeline, we need to ensure that we import the asset stylesheets after the packs stylesheet. Otherwise, the mapbox-gl.css will prevail over our custom css styling.

```ruby
<%= stylesheet_pack_tag 'application', media: 'all' %>
<%= stylesheet_link_tag 'application', media: 'all' %>
```

Mapbox requires a token. You'll need to sign up for an account and create a [token](https://www.mapbox.com/account/access-tokens). Add the token to your secret yml file.

```yaml
MAPBOX_ACCESS_TOKEN: pk.************************************************************************************_MA
```
In our component js file, we import the library, get the ENV variable token and define a starting position for the map [lgn, lat].

Then we initiate the map with an hash of options, including the required style and disabling scrollZoom.

```javascript
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = process.env.MAPBOX_ACCESS_TOKEN;
const start = [-9.1370, 38.7083];

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/dark-v9',
  center: start,
  bearing: 0,
  zoom: 9,
  attributionControl: false,
  scrollZoom: false
});
```

Adding nagivation controls:

```javascript
map.addControl(new mapboxgl.NavigationControl());
```

We can setup a function to add the markers which will be called when the map finishes loading:

```javascript
function addMarkers(map) {
  map.addLayer({
        "id": "points",
        "type": "symbol",
        "source": {
            "type": "geojson",
            "data": {
                "type": "FeatureCollection",
                "features": features
            }
        },
        "layout": {
            "icon-image": "cat",
            "icon-size": 1,
            "icon-allow-overlap": true
        }
    });
}
```

Then we parse the data attributes and call our function when the map loads. We also import an image stored in the Asset Pipiline to display as a marker:

```javascript
const features = JSON.parse(mapElement.dataset.features);
const redMarker = 'http://' + window.location.host + redMarkerPng;

map.on('load', function() {
  map.loadImage(redMarker, function(error, image) {
        if (error) throw error;
        map.addImage('cat', image);
        addMarkers(map);
      });
}
```

Finally we fit the map bounds to ours markers and fly in:

```javascript
const bounds = new mapboxgl.LngLatBounds();

features.forEach((feature) => {
    bounds.extend(feature.geometry.coordinates);
});

map.fitBounds(bounds, {
      padding: 50
  });
```

## Adding a Favoriting System

A `user`can like/favorite another `model`. The simplest case is when the user is only allowed to like/favorite instances from a single model, in which case this can be represented by a `Favorite` class which will reference a user and the liked model.

In this app I have implement a solution that allows for the future implementation of more models that can be liked/favorited by using a single polymorphic `favorites` table:

```bash
$ rails generate model favorite user:references favorited:references{polymorphic}
```

This creates the follwing migration:

```ruby
class CreateFavorites < ActiveRecord::Migration
  def change
    create_table :favorites do |t|
      t.references :favorited, polymorphic: true, index: true
      t.references :user, index: true

      t.timestamps
    end
  end
end
```

And generates the following model:

```ruby
class Favorite < ActiveRecord::Base
  belongs_to :favorited, polymorphic: true
  belongs_to :user
end
```

Moving on to the user model, the following code allows us to get all the user favorites (from all likable models), but also provides a way of returning just the favorited pubs. This will come in handy later if we want to add other models to the favoriting system:

```ruby
class User < ApplicationRecord
  has_many :favorites
  has_many :favorite_pubs, through: :favorites, source: :favorited, source_type: 'Pub'

  def likes?(pub)
    favorite_pubs.any? { |p| p.id == pub.id }
  end
end
```

I've also added an instance method `likes?(pub)` that receives a pub object and returns `true`if the user has liked that pub and `false` otherwise.

I created a completely separate resource called `favorite_pubs`, but it is also possible to go with a more generic `favorites` controller. The routes will only provide for two actions: `create` and `destroy`.

I'll be submitting the requests with ajax, so the controller simply creates and destroys favorites as needed:

```ruby
class FavoritePubsController < ApplicationController
  before_action :set_pub

  def create
    Favorite.create(favorited: @pub, user: current_user)
  end

  def destroy
    Favorite.where(favorited_id: @pub.id, user_id: current_user.id).first.destroy
  end

  private

  def set_pub
    @pub = Pub.find(params[:pub_id])
  end
end
```

I'm using FontAwesome icons, which should be full when liked (`fas` class) and empty otherwise (`far`class). I've setup event listeners for `'click'` which toggle those classes on and off and submit the relevant ajax request to create or destroy the favorites in the backend as needed:

```javascript
// pub.js

import Rails from 'rails-ujs';

const toggleIcons = function() {
  const icons = document.querySelectorAll('.menu-content i')

  const toggleIcon = function(icon) {
    icon.classList.toggle('far');
    icon.classList.toggle('fas');
  }

  icons.forEach((icon) => {
    const pub = icon.closest('.card-row')
    const pubId = pub.id.split('-')[1]
    icon.addEventListener('click', () => {
      if (icon.classList.contains('far')) {
        fetch('/favorite_pubs', {
          method: 'post',
          body: JSON.stringify({pub_id: pubId}),
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': Rails.csrfToken()
          },
          credentials: 'same-origin'
        }).then(() => toggleIcon(icon))

      } else if (icon.classList.contains('fas')) {
        fetch(`/favorite_pubs/${pubId}`, {
          method: 'delete',
          body: JSON.stringify({pub_id: pubId}),
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': Rails.csrfToken()
          },
          credentials: 'same-origin'
        }).then(() => toggleIcon(icon))
      }
    })
  })
};

export { toggleIcons };
```

And finally setup the server side generated frontend with the logic to determine which class should be applied on the first page load:

```erb
<li>
  <%= icon(current_user.likes?(pub) ? "fas" : "far" , "heart") %>
<li>
```

## Setting up Devise for AJAX requests

Let's say you want to have your devise Sign In and Sign Up forms be displayed in a modal and submitt those authentication actions via ajax.

First, expose the devise controllers:

```bash
$ rails generate devise:controllers users
```

This gives you access to all the devise controllers for the `User` model.

Inside `app/controllers/users` add this single line to the `SessionsController`and `RegistrationsController`:

```ruby
respond_to :html, :js
```

There is no need to uncomment the rest of the code.

Next, edit the routes to map devise to the custom Sessions and Registration controllers:

```ruby
Rails.application.routes.draw do
  devise_for :users, controllers: {
        sessions: 'users/sessions',
        registrations: 'users/registrations'
      }
end
```

You'll need access to the devise views:

```bash
$ rails generate devise:views
```

Finally, submit your Sign Up and Sign In links with `remote: true`. Rails will look for a `new.js.erb` inside the respective views folder (`app/views/devise/sessions`or `app/views/devise/registrations`).

Inside `new.js.erb` you can target a modal and inject the devise form:

```javascript
var modalContent = "<%= j render(partial: 'devise/shared/authentication') %>";
var modal = document.getElementById('mainModal');

modal.querySelector('.modal-content').innerHTML = modalContent;
```
