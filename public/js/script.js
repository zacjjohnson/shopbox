document.addEventListener(
  "DOMContentLoaded",
  () => {
    console.log("Project-2 JS imported successfully!");




let totalPrice = {
  book: 0,
  movie: 0
}

function totalValue(book, movie){
  let totalPrice = (book + movie) * 1.06;
  document.getElementById('totalPrice').value = `$${totalPrice.toFixed(2)}`;
}



  document.getElementById('selectBook').onchange = function(e) {
    let bookOptions = document.getElementsByClassName('selectBook')
  
    for(i in bookOptions){
      if(bookOptions[i].selected){
        let book = bookOptions[i].getAttribute('data-price');
        totalPrice.book = Number(book);
        console.log(book)
      }
      totalValue(totalPrice.book, totalPrice.movie)
    }
    return book;
  }
  
  document.getElementById('selectMovie').onchange = function(e) {
    let movieOptions = document.getElementsByClassName('selectMovie');
    for(i in movieOptions){
  
      if(movieOptions[i].selected){
        let movie = movieOptions[i].getAttribute('data-price');
        totalPrice.movie = Number(movie);
        
      }
      totalValue(totalPrice.book, totalPrice.movie)
    }
    
    return movie;
  }
  
  
  



    
    // let newPrice = document.getElementsByClassName("invoice-total-input").value=`${bookPrice + moviePrice}`;

    // console.log(newPrice)

    // const totalPrice = (moviePrice, bookPrice) => {
    //   console.log(moviePrice + bookPrice.value)
    //   return moviePrice + bookPrice
    // }

    // totalPrice(bookPrice.value, moviePrice.value)

  },
  false
);

