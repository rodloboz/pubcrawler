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
