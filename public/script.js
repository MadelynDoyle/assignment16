const getBooks = async () => {
  try {
    return (await fetch("api/books/")).json();
  } catch (error) {
    console.log(error);
  }
};

const showBooks = async () => {
  try {
    let books = await getBooks();
    let booksDiv = document.getElementById("book-list");
    booksDiv.innerHTML = "";

    books.forEach((book) => {
      const section = document.createElement("section");
      section.classList.add("book");
      booksDiv.append(section);

      const a = document.createElement("a");
      a.href = "#";
      section.append(a);

      const h3 = document.createElement("h3");
      h3.textContent = book.title;
      a.append(h3);

      const img = document.createElement("img");
      img.src = book.img;
      section.append(img);

      a.onclick = (e) => {
        e.preventDefault();
        displayDetails(book);
      };
    });
  } catch (error) {
    console.log(error);
  }
};

const displayDetails = (book) => {
  const bookDetails = document.getElementById("book-details");
  bookDetails.innerHTML = "";

  const h3 = document.createElement("h3");
  h3.textContent = book.title;
  bookDetails.append(h3);

  const dLink = createLink("&#x2715;", "delete-link");
  const eLink = createLink("&#9998;", "edit-link");

  bookDetails.append(dLink, eLink);

  const p = document.createElement("p");
  p.textContent = book.description;
  bookDetails.append(p);

  const ul = document.createElement("ul");
  bookDetails.append(ul);

  book.maincharacters.forEach((maincharacter) => {
    const li = document.createElement("li");
    li.textContent = maincharacter;
    ul.append(li);
  });

  eLink.onclick = (e) => {
    e.preventDefault();
    document.querySelector(".dialog").classList.remove("transparent");
    document.getElementById("add-edit-title").textContent = "Edit Book";
  };

  dLink.onclick = (e) => {
    e.preventDefault();
    deleteBook(book);
  };

  populateEditForm(book);
};

const createLink = (text, id) => {
  const link = document.createElement("a");
  link.innerHTML = text;
  link.id = id;
  return link;
};

const deleteBook = async (book) => {
  try {
    let response = await fetch(`/api/book/${book._id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
    });

    if (response.status !== 200) {
      console.log("Error deleting");
      return;
    }

    showBooks();
    document.getElementById("book-details").innerHTML = "";
    resetForm();
  } catch (error) {
    console.log(error);
  }
};

const populateEditForm = (book) => {
  const form = document.getElementById("add-edit-book-form");
  form._id.value = book._id;
  form.title.valueOf = book.title;
  form.genre.value = book.genre;
  form.rating.value = book.rating;
  populateMainCharacter(book);
};

const populateMainCharacter = (book) => {
  const section = document.getElementById("book-boxes");
  section.innerHTML = "";

  book.maincharacters.forEach((maincharacter) => {
    const input = createInput("text", maincharacter);
    section.append(input);
  });
};

const createInput = (type, value) => {
  const input = document.createElement("input");
  input.type = type;
  input.value = value;
  return input;
};

const addEditBook = async (e) => {
  e.preventDefault();
  const form = document.getElementById("add-edit-book-form");
  const formData = new FormData(form);
  formData.append("maincharacters", getMainCharacters());

  try {
    let response;

    if (form._id.value === "-1") {
      formData.delete("_id");

      response = await fetch("/api/books", {
        method: "POST",
        body: formData,
      });
    } else {
      response = await fetch(`/api/books/${form._id.value}`, {
        method: "PUT",
        body: formData,
      });
    }

    if (response.status !== 200) {
      console.log("Error posting data");
      return;
    }

    const book = await response.json();

    if (form._id.value !== -1) {
      displayDetails(book);
    }

    resetForm();
    document.querySelector(".dialog").classList.add("transparent");
    showBooks();
  } catch (error) {
    console.log(error);
  }
};

const getMainCharacters = () => {
  const inputs = document.querySelectorAll("#book-boxes input");
  return Array.from(inputs).map((input) => input.value);
};

const resetForm = () => {
  const form = document.getElementById("add-edit-book-form");
  form.reset();
  form._id.value = "-1";
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
  const input = createInput("text", "");
  section.append(input);
};

window.onload = () => {
  showBooks();
  document.getElementById("add-edit-book-form").onsubmit = addEditBook;
  document.getElementById("add-link").onclick = showHideAdd;

  document.querySelector(".close").onclick = () => {
    document.querySelector(".dialog").classList.add("transparent");
  };

  document.getElementById("add-maincharacter").onclick = addMainCharacter;
};