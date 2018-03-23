# pubcrawlers mock app

Rails app generated with [lewagon/rails-templates](https://github.com/lewagon/rails-templates), created by the [Le Wagon coding bootcamp](https://www.lewagon.com) team.

This app is intended to showcase the implementation of some of the most common features used by Le Wagon students in their projects using webpacker and ES6 syntax as opposed to jQuery and the Asset Pipeline as recommended by the course curriculum.

It is not meant to be the end-all implementation solution for these features, but merely to be used as a reference tool, namely to the Le Wagon Lisbon teaching staff and others.

Live demo here https://pubcrawlerapp.herokuapp.com/

## Table of Contents

* [Getting started](#getting-started)
* [Deploying to Heroku](#deploying-to-heroku)
* [Adding a Datepicker](#adding-a-datepicker)
* [Adding Google Maps](#adding-google-maps)
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
$ yarn add flackpicker
```

Then in the pack file responsible for importing css, in this case `app/javascript/packs/application.css`

```javascript
@import '../styles/flatpickr.css';
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
