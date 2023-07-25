const API = 'http://localhost:8000/products'

let inpTitle = $('#title')
let inpPrice = $('#price')
let btnAdd = $('#btn-add')
let list = $('#product-list')

// Edit

let inpTitleEdit = $('#titleEdit')
let inpPriceEdit = $('#priceEdit')
let btnSaveEdit = $('#btn-save-edit')

let searchInput = $('input[type="search"]');
let searchButton = $('.btn-outline-success');

searchButton.on('click', function () {
    let searchText = searchInput.val().trim();
    console.log(searchText);
    getAllProducts(searchText);
});

function getAllProducts(query = '') {
    fetch(API)
      .then((res) => res.json())
      .then((data) => {
        list.html('')
        data.forEach((product) => {
          if (query === '' || product.title.toLowerCase().includes(query.toLowerCase())) {
            let elem = drawCard(product)
            list.append(elem)
          }
        })
      })
  }

getAllProducts()

$('#search-form').on('submit', function (event) {
    event.preventDefault()
    let searchQuery = $('#search-input').val()
    getAllProducts(searchQuery)
  })

function drawCard(item){
    return`
    <div id="products-list" class="d-flex flex-wrap justify-content-center mt-5">
    <div class="card" style="width: 18rem;">
        <div class="card-body">
            <h5 class="card-title">${item.title}</h5>
            <a href="#" class="card-link">
                <h6>$ ${item.price}</h6>
            </a>
            <p class="card-text">Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
            <button id=${item.id} data-bs-toggle="modal" data-bs-target="#exampleModal" type="button" class="btn btn-info btn-edit">Edit</button>
            <button id=${item.id} type="button" class="btn btn-danger btn-del">Delete</button>
        </div>
    </div>
</div>
    `
}


// CREATE

// post request

function postProduct(newProduct) {
    fetch(API, {
        method: "POST",
        headers: {
            "Content-type": "application/json; charset=utf-8" // Указываем серверу, что отправляем запрос в формате JSON и кодировке UTF-8
        },
        body: JSON.stringify(newProduct) // передаем вместе с запросом - наш новый объект
    }).then(() => getAllProducts())
}


// post btn
btnAdd.on('click', function(){
    let valTitle = inpTitle.val()
    let valPrice = inpPrice.val()
    if(!valTitle.trim() || !valPrice.trim()){
        alert('Заполните поля')
        return
    }
    let obj = {
        title: valTitle,
        price: valPrice
    }
    postProduct(obj)
})

// DELETE

$('body').on('click', '.btn-del', function() {
    fetch(`${API}/${this.id}`, {
        method: "DELETE"
    })
    .then(() => getAllProducts())
})

getAllProducts()



// Edit

$('body').on('click', '.btn-edit', function(){
    fetch(`${API}/${this.id}`)
    .then((res) => res.json())
    .then((data) => {
        inpTitleEdit.val(data.title)
        inpPriceEdit.val(data.price)
        btnSaveEdit.attr('id', data.id)
    })
})

function saveEdit (editedProduct, id){
    fetch(`${API}/${id}`, {
        method: "PATCH", // метод PATCH, для того чтобы объект изменился только в тех местах где мы указали какие-либо данные 
        headers: {
            "Content-type": "application/json; charset=utf-8"
        },
        body: JSON.stringify(editedProduct)
    }).then(() =>  {
        getAllProducts()
        $('exampleModal').modal('hide')
    })
}

btnSaveEdit.on('click', function () {
    console.log(inpTitleEdit.val(), inpPriceEdit.val());
    if(!inpTitleEdit.val().trim() || !inpPriceEdit.val().trim()){
        alert('Заполните поля')
        return
    }
    let obj = {
        title: inpTitleEdit.val(),
        price: inpPriceEdit.val()
    }
    saveEdit(obj, this.id)
})