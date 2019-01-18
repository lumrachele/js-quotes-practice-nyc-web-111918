let quoteArray =[]
document.addEventListener('DOMContentLoaded', ()=>{

  //************ CONSTANTS ************/
  const quoteList = document.querySelector("#quote-list")
  const newQuoteForm = document.querySelector("#new-quote-form")
  const newQuoteInput = newQuoteForm.querySelector("#new-quote")
  const newAuthorInput = newQuoteForm.querySelector("#author")
  const deleteButton = quoteList.querySelector(`[data-button-id='delete']`)
  const likeButton = quoteList.querySelector(`[data-button-id='like']`)
  const editQuoteForm = document.querySelector("#edit-quote-form")
  const inputEditQuote = document.querySelector("#inputEditQuote")
  const inputEditAuthor = document.querySelector("#inputEditAuthor")

  //************ get the quotes ************/
  function getQuotesFetchRequest(){
    fetch(`http://localhost:3000/quotes`, {
      method: "GET",
    headers:{
      'Content-Type': 'application/json',
      Accept: 'application/json'}
    })//end of fetch
    .then((res)=>{
      return res.json()
    })
    .then((quotes)=>{
      quoteArray = quotes
      quoteList.innerHTML = mapQuoteCards(quotes)
    })
  }


//********* HELPER FUNCTIONS **********/
  function mapQuoteCards (array){
    return array.map((quote)=>{
      return renderQuoteCard(quote)
    }).join("")
  }

  function renderQuoteCard(quoteInfo){
    return `
    <li class='quote-card' data-quote-card-id=${quoteInfo.id}>
      <blockquote class="blockquote">
        <p class="mb-0">${quoteInfo.quote}</p>
        <footer class="blockquote-footer">${quoteInfo.author}</footer>
        <br>

        <button class='btn-success' data-button-id="like" data-quote-id=${quoteInfo.id} >Likes: <span>${quoteInfo.likes}</span></button>

        <button data-button-id="edit" data-quote-id=${quoteInfo.id} class='btn-primary'>Edit</button>

        <button data-button-id="delete" data-quote-id=${quoteInfo.id} class='btn-danger'>Delete</button>
      </blockquote>
    </li>
    `
  }

//********* EVENT LISTENERS **********/
// new quote - post request

  newQuoteForm.addEventListener("submit", (e)=>{
    e.preventDefault()
    const newQuote = newQuoteInput.value
    const newAuthor = newAuthorInput.value

    fetch(`http://localhost:3000/quotes`, {
      method: "POST",
      headers:{
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },//end of headers
      body: JSON.stringify({
        quote: newQuote,
        author: newAuthor,
        likes: 0
      })//end of body stringify
    })//end of fetch
    .then((res)=>{
      return res.json()
    })
    .then((addedQuote)=>{
      quoteArray.push(addedQuote)
      newQuoteForm.reset()
      getQuotesFetchRequest ()
      // quoteList.innerHTML+=renderQuoteCard(addedQuote)
    })

  })//end of event listener for new/create

  //event listener for buttons
  quoteList.addEventListener("click", (e)=>{
    // if it's the delete button
    if (e.target.dataset.buttonId === "delete"){
      const foundQuote = quoteArray.find((quote)=>{
        return quote.id == e.target.dataset.quoteId
      })//end of foundQuote
      const indexOfQuote = quoteArray.indexOf(foundQuote)

      fetch(`http://localhost:3000/quotes/${e.target.dataset.quoteId}`, {
        method: "DELETE"
      })//end of fetch
      quoteArray.splice(indexOfQuote, 1)
      quoteList.innerHTML = mapQuoteCards(quoteArray)

    }//end of delete button
    else if (e.target.dataset.buttonId === "like"){
      console.log(e.target.innerText.split("Likes: ")[1]);
      let likeAmt = parseInt(e.target.innerText.split("Likes: ")[1])
      //send a patch request to update the likes
      fetch(`http://localhost:3000/quotes/${e.target.dataset.quoteId}`, {
        method: "PATCH",
        headers:{
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },//end of headers
        body: JSON.stringify({
          likes: likeAmt+=1
        })//end of body stringify
      })//end of fetch
      .then((res)=>{
        return res.json()
      })
      .then((updatedLikes)=>{
        // quoteList.innerHTML = mapQuoteCards(quoteArray)
        getQuotesFetchRequest ()
      })


    }//end of like button
    //render edit form
    else if (e.target.dataset.buttonId==="edit"){
      editQuoteForm.style.display="block"

      const quoteToEdit = quoteArray.find((quote)=>{
        return quote.id == e.target.dataset.quoteId
      })
      inputEditQuote.value = quoteToEdit.quote
      inputEditAuthor.value = quoteToEdit.author

      fetch(`http://localhost:3000/quotes/${quoteToEdit.id}`, {
        method: "GET"
      })//end of fetch
      .then((res)=>{
        return res.json()
      })
      .then((quote)=>{
        editQuoteForm.dataset.id = quote.id
      })



    }// end of edit button
  })//end of buttons event listener

  editQuoteForm.addEventListener("submit", (e)=>{
    e.preventDefault()
    // console.log(e.target.dataset.id);
    const editedQuote = inputEditQuote.value
    const editedAuthor = inputEditAuthor.value

    fetch(`http://localhost:3000/quotes/${e.target.dataset.id}`, {
      method: "PATCH",
      headers:{
        'Content-Type': 'application/json',
        Accept: 'application/json'},
      body: JSON.stringify({
        quote: editedQuote,
        author: editedAuthor
      })//end of body json stringify
    })//end of fetch
    .then((res)=>{
      return res.json()
    })
    .then((returnedQuote)=>{
      //update the dom
      const quoteCardToUpdate = document.querySelector(`[data-quote-card-id='${returnedQuote.id}]'`)
      editQuoteForm.style.display = "none"
      quoteCardToUpdate.innerHTML = renderQuoteCard(returnedQuote)
    })
  })//end of edit quote form event listener






getQuotesFetchRequest ()
})// end of dom content loaded
