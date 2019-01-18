let quoteArray =[]
document.addEventListener('DOMContentLoaded', ()=>{

  //************ CONSTANTS ************/
  const quoteList = document.querySelector("#quote-list")
  const newQuoteForm = document.querySelector("#new-quote-form")
  const newQuoteInput = newQuoteForm.querySelector("#new-quote")
  const newAuthorInput = newQuoteForm.querySelector("#author")
  const deleteButton = quoteList.querySelector(`[data-button-id='delete']`)
  const likeButton = quoteList.querySelector(`[data-button-id='like']`)

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
    <li class='quote-card'>
      <blockquote class="blockquote">
        <p class="mb-0">${quoteInfo.quote}</p>
        <footer class="blockquote-footer">${quoteInfo.author}</footer>
        <br>
        <button class='btn-success' data-button-id="like" data-quote-id=${quoteInfo.id} >Likes: <span>${quoteInfo.likes}</span></button>
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


    }


  })//end of delete button event listener
// `[data-note-id='${foundNote.id}']`












getQuotesFetchRequest ()
})// end of dom content loaded
