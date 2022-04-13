const url = "http://localhost:8080/movies/"

function getAllMovies() {
	fetch(url).then(response =>
		response.json().then(data => {
			$('#card-div').html("")
			for (let i = 0; i < data.length; i++) {
				if (data[i].title === undefined) {
				} else {
					let imgTag = (data[i].poster) ? `<img class="card-img-top" style="height: 429px" src="${data[i].poster}" id = "posterImage-${data[i].id}" alt="Card image cap">` : "";
					//language=HTML
					let html = `
                        <div class="card m-3" id="movie0-${data[i].id}">
                            ${imgTag}
                            <div class="descriptions">
                                <h1 id="card-title-${data[i].id}"><span contenteditable="true">${data[i].title}</span>
                                </h1>

                                <p id="actors-${data[i].id}"><span contenteditable="true">${data[i].actors}</span></p>

                                <p id="director-${data[i].id}"><span contenteditable="true">${data[i].director}</span>
                                </p>

                                <p id="genre-${data[i].id}"><span contenteditable="true">${data[i].genre}</span></p>

                                <p id="plot-${data[i].id}"><span contenteditable="true">${data[i].plot}</span></p>

                                <p id="rating-${data[i].id}" class="list-group-item d-none"><span
                                        contenteditable="true">${data[i].rating}</span></p>
                                <p>
                                <div class="rating">`;
                                    for (let j = 1; j <= 5; j++) {
                                    if (j <= data[i].rating) {
                                    html += `<i value="${j}" id="star-${j}" data-id="${data[i].id}"
                                                 class="fa fa-star ratingStar"></i>`
                                    } else {
                                    html += `<i value="${j}" id="star-${j}" data-id="${data[i].id}"
                                                 class="fa fa-star"></i>`
                                    }
                                    }
                                    html += `
                                </div>
                                </p>
                                <input type="button" value="Save My Edits" class="edit-button"
                                       onclick="saveEdits(${data[i].id})"/>
                                <input type="button" value="Delete" class="delete-button"
                                       onclick="deleteCard(${data[i].id})"/>
                            </div>
                        </div>`;
					$('#card-div').append(html);
				}
			}
			$('.gif').css("display", "none");
			$('#movies-header').css("display", "block");
			$('#movie-form').css("display", "block");
			$('#search-bar').css('display', 'block');
			$('#modal-btn').css('display', 'block');

			// Setup rating listeners after data is loaded.
			// there were no movie elements to add the star icons for
			let iconElements = $("i")
			$(".fa-star").click((event) => {
				const rating = parseInt(event.target.id.split("-")[1]);

				// console.log(event.target)
				let recordId = $(event.target).data("id")
				//data record for the id
				$(`#rating-${recordId}`).text(rating)
				updateRating(rating, event.target);
			})
			search(data);
			postNewMovie();
		})
	);
}
function search(data) {
	$('#search-bar').on('input', (e) => {
		let value = e.target.value
		for (let i = 0; i < data.length; i++) {
			if (data[i].title === undefined) {
				continue
			}
			if (data[i].title.toLowerCase().includes(value.toLowerCase()) === false) {
				document.querySelector(`#movie0-${data[i].id}`).classList.add("hide");
			}
			if (data[i].title.toLowerCase().includes(value.toLowerCase()) === true) {
				document.querySelector(`#movie0-${data[i].id}`).classList.remove("hide");
			}
		}
	})
}


function newMovies(newPoster, newTitle, newCast, newDirector, newYear, newGenre, newDescription, newRating) {

	$('#new-movie-submit').attr('disabled', true);
	const userInput = {
		title: newTitle,
		rating: newRating,
		poster: newPoster,
		year: newYear,
		genre: newGenre,
		director: newDirector,
		plot: newDescription,
		actors: newCast
	};
	const options = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(userInput),
	};

	fetch(url, options)
		.then(response => {
			$('#new-movie-submit').attr('disabled', false);
			getAllMovies()
		})
}

function postNewMovie() {

	$("#new-movie-submit").click((e) => {
		let newPoster = $('#newPoster').val();
		let newTitle = $('#newTitle').val();
		let newCast = $('#newCast').val();
		let newDirector = $('#newDirector').val();
		let newYear = $('#newYear').val();
		let newGenre = $('#newGenre').val();
		let newDescription = $('#newDescription').val();
		let newRating = $('#newRating').val();
		$('#newPoster').val("");
		$('#newTitle').val("");
		$('#newCast').val("");
		$('#newDirector').val("");
		$('#newYear').val("");
		$('#newGenre').val("");
		$('#newDescription').val("");
		$('#newRating').val("");
		newMovies(newPoster, newTitle, newCast, newDirector, newYear, newGenre, newDescription, newRating);
		getAllMovies();
	});
}

// const star = parseInt(element.id.split("-")[1]);

function saveEdits(id) {
	let id1 = id;
	let poster1 = $("#posterImage-" + id).attr("src");
	let editedTitle = $('#card-title-' + id).text();
	let editedCast = $('#actors-' + id).text();
	let editedDirector = $('#director-' + id).text();
	let editedGenre = $('#genre-' + id).text();
	let editedDescription = $('#plot-' + id).text();
	let editedRating = $('#rating-' + id).text();

	const userInput = {
		poster: poster1.trim(),
		title: editedTitle.trim(),
		actors: editedCast.trim(),
		director: editedDirector.trim(),
		genre: editedGenre.trim(),
		plot: editedDescription.trim(),
		rating: editedRating
	}
	fetch(url + "/" + id1, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(userInput),
	}).then(response => {
		getAllMovies()
	});
}

function deleteCard(id) {
	let id1 = id;
	fetch(url + "/" + id1, {
		method: 'DELETE'
	}).then(response => {
		getAllMovies()
	});
}


//creating a rate but not not saving the rate YET
function updateRating(userRating, targetElement) {
	const siblings = Array.from(targetElement.parentElement.getElementsByTagName('i'));
	// targetElement is each of the i (star) elements
	siblings.forEach(element => {
		const ratingToCheck = parseInt(element.id.split("-")[1]);
		// splitting out the star part of ID to only read the number of the element
		if (ratingToCheck <= userRating) {
			if (!element.classList.contains("ratingStar")) {
				element.classList.add("ratingStar");
			}
		} else {
			element.classList.remove("ratingStar");
		}
	});
	// TODO: save the rating value
}


setTimeout(getAllMovies, 2000);
