$( document ).ready(async function() {
  const photos = await getAllPictures();
  displayAllPictures(photos);
});

async function getAllPictures() {
  try {
    const response = await fetch('/api/v1/photos');
    const photos = response.json();

    return photos;
  } catch (err) {
    throw err;
  }

}

function displayAllPictures(photos) {
  if (Array.isArray(photos)) {
    photos.map((photo) => {
      let photoCard = `<article>
          <h6>${photo.title}</h6>
          <img src=${photo.url}/>
        </article>`
        console.log(photoCard);
      $('.photo-card-container').append(photoCard);
    })
  } else {
    return (
      $('.photo-card-container').innerHTML = "The data is not an array."
    )
  }
}
