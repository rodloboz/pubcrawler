import Rails from 'rails-ujs';
Rails.start()

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
        $.ajax({
          type: 'POST',
          url: '/favorite_pubs',
          data: {pub_id: pubId},
          success: function(response){
            toggleIcon(icon)
          },
          error: function(response){
            alert('error')
          }
        })
      } else if (icon.classList.contains('fas')) {
        $.ajax({
          type: 'DELETE',
          url: `/favorite_pubs/${pubId}`,
          data: {pub_id: pubId},
          success: function(response){
            toggleIcon(icon)
          },
          error: function(response){
            alert('error')
          }
        })
      }
    })
  })
};

export { toggleIcons };
