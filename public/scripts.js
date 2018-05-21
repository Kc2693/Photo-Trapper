$( document ).ready(async function() {
  const photos = await getAllPictures();
  displayAllPictures(photos);
});

$('.add-photo-btn').click(async function(event) {
  event.preventDefault();

  await postNewPhoto();

  const photos = await getAllPictures();
  displayAllPictures(photos);
})

$('.delete-btns')


async function getAllPictures() {
  try {
    const response = await fetch('/api/v1/photos');
    const photos = response.json();

    return photos;
  } catch (err) {
    throw err;
  }
}

async function postNewPhoto() {
  const title = $('.photo-title-input').val();
  const url = $('.photo-url-input').val();
  const body = {title, url}

  try {
    const response = fetch('api/v1/photos',{
      method:'POST',
      headers:{
        'Accept':'application/json',
        'Content-Type':'application/json',
      },
      body: JSON.stringify(body)
    })
    return response;
  } catch (err) {
    throw err;
  }
}

function displayAllPictures(photos) {
  $('.photo-card-container').empty();

  if (Array.isArray(photos)) {
    photos.map((photo) => {
      let photoCard = `<article class="photo-card" id=${photo.id}>
          <img id="photo" src=${photo.url}/>
          <h6>${photo.title}</h6>
          <button id="delete-btn" onClick="deletePhoto(event)">t</button>
        </article>`

      $('.photo-card-container').append(photoCard);
    })
  } else {
    return (
      $('.photo-card-container').innerHTML = "The data is not an array."
    )
  }
}

async function deletePhoto(event) {
  let parentNode = $(event.target).parent();
  let parentId = parentNode.attr('id')

  await deletePhotoFromDb(parentId);
  displayAllPictures();
}

async function deletePhotoFromDb(id) {
  try {
    const response = await fetch('api/v1/photos', {
      method: 'DELETE',
      headers: {
        'Accept':'application/json',
        'Content-Type':'application/json',
      },
      body: JSON.stringify(id)
    })

    return response;
  } catch (err) {
    throw err;
  }
}
