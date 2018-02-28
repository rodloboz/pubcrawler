function autocomplete() {
  document.addEventListener("DOMContentLoaded", function() {
    var pubAddress = document.getElementById('pub_address');

    if (pubAddress) {
      var autocomplete = new google.maps.places.Autocomplete(pubAddress, { types: [ 'geocode' ] });
      google.maps.event.addDomListener(pubAddress, 'keydown', function(e) {
        if (e.key === "Enter") {
          e.preventDefault(); // Do not submit the form on Enter.
        }
      });
    }
  });
}

export { autocomplete };
