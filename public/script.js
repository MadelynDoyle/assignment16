const getBooks = async () => {
    try {
      return (await fetch("api/books/")).json();
    } catch (error) {
      console.log(error);
    }
  };
  
  const showBooks = async () => {
    let books = await getBooks();
    let booksDiv = document.getElementById("book-list");
    bookDiv.innerHTML = "";
    books.forEach((book) => {
      const section = document.createElement("section");
      section.classList.add("book");
      bookDiv.append(section);
  
      const a = document.createElement("a");
      a.href = "#";
      section.append(a);
  
      const h3 = document.createElement("h3");
      h3.innerHTML = book.title;
      a.append(h3);
  
      const img = document.createElement("img");
      img.src = book.img;
      section.append(img);
  
      a.onclick = (e) => {
        e.preventDefault();
        displayDetails(recipe);
      };
    });
  };
  
  const displayDetails = (book) => {
    const bookDetails = document.getElementById("book-details");
    recipeDetails.innerHTML = "";
  
    const h3 = document.createElement("h3");
    h3.innerHTML = book.title;
    recipeDetails.append(h3);
  
    const dLink = document.createElement("a");
    dLink.innerHTML = "	&#x2715;";
    bookDetails.append(dLink);
    dLink.id = "delete-link";
  
    const eLink = document.createElement("a");
    eLink.innerHTML = "&#9998;";
    bookDetails.append(eLink);
    eLink.id = "edit-link";
  
    const p = document.createElement("p");
    bookDetails.append(p);
    p.innerHTML = book.description;
  
    const ul = document.createElement("ul");
    bookDetails.append(ul);
    console.log(book.maincharacters);
    recipe.maincharacters.forEach((maincharacter) => {
      const li = document.createElement("li");
      ul.append(li);
      li.innerHTML = maincharacter;
    });
  
    eLink.onclick = (e) => {
      e.preventDefault();
      document.querySelector(".dialog").classList.remove("transparent");
      document.getElementById("add-edit-title").innerHTML = "Edit Book";
    };
  
    dLink.onclick = (e) => {
      e.preventDefault();
      deleteBook(book);
    };
  
    populateEditForm(book);
  };
  
  const deleteBook = async (book) => {
    let response = await fetch(`/api/book/${book._id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
    });
  
    if (response.status != 200) {
      console.log("error deleting");
      return;
    }
  
    let result = await response.json();
    showBooks();
    document.getElementById("book-details").innerHTML = "";
    resetForm();
  };
  
  const populateEditForm = (book) => {
    const form = document.getElementById("add-edit-book-form");
    form._id.value = book._id;
    form.title.value = book.title;
    form.genre.value = book.genre;
    form.rating.value = book.rating;
    populateMainCharacter(book);
  };
  
  const populateMainCharacter = (book) => {
    const section = document.getElementById("book-boxes");
  
    book.maincharacters.forEach((maincharacter) => {
      const input = document.createElement("input");
      input.type = "text";
      input.value = maincharacter;
      section.append(input);
    });
  };
  
  const addEditBook = async (e) => {
    e.preventDefault();
    const form = document.getElementById("add-edit-book-form");
    const formData = new FormData(form);
    let response;
    formData.append("maincharacters", getMainCharacters());
  
    if (form._id.value == -1) {
      formData.delete("_id");
  
      response = await fetch("/api/books", {
        method: "POST",
        body: formData,
      });
    }
    else {
      console.log(...formData);
  
      response = await fetch(`/api/books/${form._id.value}`, {
        method: "PUT",
        body: formData,
      });
    }
  
    if (response.status != 200) {
      console.log("Error posting data");
    }
  
    book = await response.json();
  
    if (form._id.value != -1) {
      displayDetails(book);
    }
  
    resetForm();
    document.querySelector(".dialog").classList.add("transparent");
    showBooks();
  };
  
  const getMainCharacters = () => {
    const inputs = document.querySelectorAll("#book-boxes input");
    let maincharacters = [];
  
    inputs.forEach((input) => {
      maincharacters.push(input.value);
    });
  
    return maincharacters;
  };
  
  const resetForm = () => {
    const form = document.getElementById("add-edit-book-form");
    form.reset();
    form._id = "-1";
    document.getElementById("maincharacter-boxes").innerHTML = "";
  };
  
  const showHideAdd = (e) => {
    e.preventDefault();
    document.querySelector(".dialog").classList.remove("transparent");
    document.getElementById("add-edit-title").innerHTML = "Add Book";
    resetForm();
  };
  
  const addMainCharacter = (e) => {
    e.preventDefault();
    const section = document.getElementById("maincharacter-boxes");
    const input = document.createElement("input");
    input.type = "text";
    section.append(input);
  };
  
  window.onload = () => {
    showRecipes();
    document.getElementById("add-edit-book-form").onsubmit = addEditBook;
    document.getElementById("add-link").onclick = showHideAdd;
  
    document.querySelector(".close").onclick = () => {
      document.querySelector(".dialog").classList.add("transparent");
    };
  
    document.getElementById("add-maincharacter").onclick = addMainCharacter;
  };