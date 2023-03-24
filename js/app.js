// data load form api
const loadData = (dataLimit) => {
    const url = `https://openapi.programming-hero.com/api/ai/tools`
    fetch(url)
        .then(res => res.json())
        .then(data => displayData(data.data.tools, dataLimit))
}

// display data form api
const displayData = (datas, dataLimit) => {
    const cardsContainer = document.getElementById('cards-container');
    cardsContainer.textContent = '';

    // show 6 data at first time
    const showMoreBtn = document.getElementById('show-more');
    if (dataLimit && datas.length > 6) {
        datas = datas.slice(0, 6);
        showMoreBtn.classList.remove('d-none');
    }
    else {
        showMoreBtn.classList.add('d-none');
    }

    // show all data
    datas.forEach(data => {
        const cardContainer = document.createElement("div");
        // start spinner
        toggleLoader(true);
        cardContainer.innerHTML = `
        <div class="card h-100">
            <img src="${data.image}" class="card-img-top">
            <div class="card-body">
                <h5 class="card-title">Features</h5>
                <ol>
                    <li class ="${data.features[0] === undefined ? 'd-none' : ''}">${data.features[0]}</li>
                    <li class ="${data.features[1] === undefined ? 'd-none' : ''}">${data.features[1]}</li>
                    <li class ="${data.features[2] === undefined ? 'd-none' : ''}">${data.features[2]}</li>
                    <li class ="${data.features[3] === undefined ? 'd-none' : ''}">${data.features[3]}</li>
                </ol>
            </div>
            <div class="card-footer d-flex justify-content-between align-items-center">
                <div>
                    <h3 class="card-title">${data.name}</h3>
                    <p><i class="fa-solid fa-calendar-days me-2"></i> ${data.published_in}</p>
                </div>
                    <button class="btn btn-primary rounded-circle" data-bs-toggle="modal" data-bs-target="#cardModal" onclick="loadModalDetails('${data.id}')"><i class="fa-solid fa-arrow-right"></i></button>
            </div>
        </div>
        `
        // stop spinner
        toggleLoader(false);
        cardsContainer.appendChild(cardContainer);
    });
}

// spinner
const toggleLoader = (isLoading) => {
    const loader = document.getElementById('spinner');
    if (isLoading) {
        loader.classList.remove('d-none');
    }
    else {
        loader.classList.add('d-none');
    }
}

// show more button
document.getElementById('show-more').addEventListener('click', function () {
    loadData(0);
})

// load modal details
const loadModalDetails = (id) => {
    const url = `https://openapi.programming-hero.com/api/ai/tool/${id}`
    fetch(url)
        .then(res => res.json())
        .then(data => showModalDetails(data.data))
}

// display modal details
const showModalDetails = (data) => {
    // left section
    const detailsLeft = document.getElementById('details-left');
    // getDataFormObj();
    const singleData = Object.values(data.features);
    detailsLeft.innerHTML = `
        <h4>${data.description}</h4>
        <div class="d-flex flex-lg-row flex-md-row flex-column gap-2 my-3">
            <div class="bg-white p-2 rounded-3">
                <h5 class="text-center text-success">${data.pricing ? data.pricing[0].price === "No cost" || data.pricing[0].price === "0" ? "Free Of cost/Basic" : data.pricing[0].price : 'Free Of cost/Basic'}</h5>
            </div>
            <div class="bg-white p-2 rounded-3">
                <h5 class="text-center text-warning">${data.pricing ? data.pricing[1].price === "No cost" || data.pricing[1].price === "0" ? "Free Of cost/Pro" : data.pricing[1].price : 'Free Of cost/Pro'}</h5>
            </div>
            <div class="bg-white p-2 rounded-3">
                <h5 class="text-center text-danger">${data.pricing ? data.pricing[2].price === "No cost" || data.pricing[2].price === "0" ? "Free of Cost /Enterprise" : data.pricing[2].price : 'Free of Cost /Enterprise'}</h5>
            </div>
        </div>
        <div class="d-flex justify-content-between">
            <div>
                <h4>Features</h4>
                <ul>
                    <li class ="${singleData[0] ? '' : 'd-none'}">${singleData[0] ? singleData[0].feature_name : ""}</li>
                    <li class ="${singleData[1] ? '' : 'd-none'}">${singleData[1] ? singleData[1].feature_name : ""}</li>
                    <li class ="${singleData[2] ? '' : 'd-none'}">${singleData[2] ? singleData[2].feature_name : ""}</li>
                    <li class ="${singleData[3] ? '' : 'd-none'}">${singleData[3] ? singleData[3].feature_name : ""}</li>
                </ul>
            </div>
            <div>
                <h4>Integration</h4>
                <ul>
                    ${data.integrations?.length ? data.integrations.map((name) => `<li>${name}</li>`).join('') : 'No Data Found'}
                </ul>
            </div>
        </div>
    `
    // right section
    const detailsRight = document.getElementById('details-right');
    detailsRight.innerHTML = `
        <div class="position-relative">
            <img src="${data.image_link[0]}" class="card-img-top rounded-4">
            <h4 class="text-center mt-3">${data.input_output_examples ? data.input_output_examples[0].input : "Can you give any example?"}</h4>
            <p class="text-center text-secondary">${data.input_output_examples ? data.input_output_examples[0].output : "No! Not Yet! Take a break!!!"}</p>
            <div class="position-absolute mt-2 me-2 top-0 end-0 bg-danger
            text-white p-1 rounded-3 ${data.accuracy.score === null ? 'd-none' : ''}">${data.accuracy.score * 100} accuracy</div>
        </div>
    `
}

// sort by date
const sortingData = (a, b) => {
    const dateA = new Date(a.published_in);
    const dateB = new Date(b.published_in);
    if (dateA > dateB) return 1;
    else if (dateA < dateB) return -1;
    return 0;
}


const LoadSortData = () => {
    const url = `https://openapi.programming-hero.com/api/ai/tools`
    fetch(url)
        .then(res => res.json())
        .then(data => displayData(data.data.tools.sort(sortingData)))
}

loadData(6);