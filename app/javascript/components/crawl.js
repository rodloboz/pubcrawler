import Rails from 'rails-ujs';

const toggleCrawlIcons = function() {
  const icons = document.querySelectorAll('.crawl .menu-content i')

  const toggleIcon = function(icon) {
    icon.classList.toggle('far');
    icon.classList.toggle('fas');
  }

  icons.forEach((icon) => {
    const crawl = icon.closest('.card-row')
    const crawlId = crawl.id.split('-')[1]
    icon.addEventListener('click', () => {
      if (icon.classList.contains('far')) {
        fetch('/favorite_crawls', {
          method: 'post',
          body: JSON.stringify({crawl_id: crawlId}),
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': Rails.csrfToken()
          },
          credentials: 'same-origin'
        }).then((response) => {
            if (response.ok) {
              toggleIcon(icon)
            } else {
              throw new Error('Something went wrong');
            }
          });
      } else if (icon.classList.contains('fas')) {
        fetch(`/favorite_crawls/${crawlId}`, {
          method: 'delete',
          body: JSON.stringify({crawl_id: crawlId}),
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': Rails.csrfToken()
          },
          credentials: 'same-origin'
        }).then((response) => {
            if (response.ok) {
              toggleIcon(icon)
            } else {
              throw new Error('Something went wrong');
            }
          });
      }
    })
  })
};

export { toggleCrawlIcons };
