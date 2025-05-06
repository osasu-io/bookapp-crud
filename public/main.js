
// grab all the "mark read/unread" buttons
var toggleBtns = document.getElementsByClassName("toggle-read")
// grab all the "delete" buttons
var deleteBtns = document.getElementsByClassName("delete")

// loop through all the toggle buttons
Array.from(toggleBtns).forEach(function(button) {
  button.addEventListener('click', function() {
    // grabbing the book title + author from the button's data attributes
    const title = this.dataset.title
    const author = this.dataset.author
    const read = this.dataset.read

    // send PUT request to server to update book read status
    fetch('books', {
      method: 'put',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: title,
        author: author,
        read: read // backend will flip true/false
      })
    }).then(res => {
      if (res.ok) return res.json()
    }).then(data => {
      console.log('marked read/unread')
      window.location.reload(true) // refresh the page
    })
  })
})

// loop through all the delete buttons
Array.from(deleteBtns).forEach(function(button) {
  button.addEventListener('click', function() {
    const title = this.dataset.title
    const author = this.dataset.author

    // send DELETE request to server to remove book
    fetch('books', {
      method: 'delete',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: title,
        author: author
      })
    }).then(res => {
      console.log('deleted book')
      window.location.reload()
    })
  })
})
