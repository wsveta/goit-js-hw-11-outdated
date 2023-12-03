import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';
import axios from 'axios';

const refs = {
  gallery: document.querySelector('.gallery'),
  form: document.querySelector('.search-form'),
  input: document.querySelector('input'),
  // loadBtn: document.querySelector('.load-more'),
};

const KEY = '41029112-ec6e065fca3f0d308b81a7ee5';
const URL = 'https://pixabay.com/api?key=' + KEY;

refs.form.addEventListener('submit', async event => {
  event.preventDefault();
  refs.gallery.innerHTML = '';
  // refs.loadBtn.classList.add('hidden');

  let page = 1;
  let q = refs.input.value;

  try {
    let response = await axios(
      URL +
        '&q=' +
        encodeURIComponent(q) +
        '&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=' +
        page
    );

    if (response.data.total === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.',
        { timeout: 5000 }
      );
      return;
    }
    makeCards(response.data);
    Notiflix.Notify.success(
      `Hooray! We found ${response.data.totalHits} images.`
    );

    // refs.loadBtn.addEventListener('click', async () => {
    //   page++;

    //   try {
    //     const nextPageResponse = await axios(url + page);

    //     if (nextPageResponse.data.totalHits - page * 40 < 40) {
    //       console.log(nextPageResponse.data.totalHits - page * 40);
    //       makeCards(nextPageResponse.data);
    //       Notiflix.Notify.failure(
    //         "We're sorry, but you've reached the end of search results.",
    //         nextPageResponse.data.totalHits % 40,
    //         { timeout: 5000 }
    //       );
    //       refs.loadBtn.classList.add('hidden');
    //       return;
    //     }

    //     makeCards(nextPageResponse.data);
    //   } catch (error) {
    //     throw new Error('Error fetching next page:', error);
    //   }
    // });
  } catch (error) {
    Notiflix.Notify.failure('Something went wrong. Try reloading the page.', {
      timeout: 5000,
    });
    console.log(error);
  }
});

function makeCards(value) {
  const markup = value.hits
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<a href="${largeImageURL}"><div class="photo-card">
  <img class="image" src="${webformatURL}" alt="${tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes</b><br>${likes}
    </p>
    <p class="info-item">
      <b>Views</b><br>${views}
    </p>
    <p class="info-item">
      <b>Comments</b><br>${comments}
    </p>
    <p class="info-item">
      <b>Downloads</b><br>${downloads}
    </p>
  </div>
</div></a>`;
      }
    )
    .join('');
  refs.gallery.innerHTML += markup;
  // refs.loadBtn.classList.remove('hidden');

  let simplelightbox = new SimpleLightbox('.gallery a', {});
  simplelightbox.refresh();

  const { height: cardHeight } =
    refs.gallery.firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight / 2,
    behavior: 'smooth',
  });
}
