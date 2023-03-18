const nameInput = document.querySelector("#name");
const ageInput = document.querySelector("#age");
const createBtn = document.querySelector("#create");
const userSection = document.querySelector("#user-section");
const userCity = document.querySelector("#city");
const searchInput = document.querySelector("#search");
const sortingByNameCheckBox = document.querySelector("#sort-by-name");
const sortingByAgeCheckBox = document.querySelector("#sort-by-age");
const paginationSection = document.querySelector("#pagination");

let users = [
  { id: generateId(), name: "Igor", age: 23, city: "Kyiv" },
  { id: generateId(), name: "Alex", age: 52, city: "Lviv" },
  { id: generateId(), name: "Julia", age: 33, city: "Odessa" },

  { id: generateId(), name: "Anna", age: 23, city: "Kyiv" },
  { id: generateId(), name: "Alex", age: 52, city: "Lviv" },
  { id: generateId(), name: "Julia", age: 33, city: "Odessa" },

  { id: generateId(), name: "Sofia", age: 23, city: "Kyiv" },
  { id: generateId(), name: "Alex", age: 52, city: "Lviv" },
  { id: generateId(), name: "Julia", age: 33, city: "Odessa" },
];

function generateId(length = 10) {
  let id = "";
  const symbols = "0123456789qwertyuiopasdfghjklzxcvbnm";
  for (let i = 0; i < length; i++) {
    id += symbols[Math.floor(Math.random() * symbols.length)];
  }
  return id;
}


let changeUser = undefined;
let paginationpagenumber = 0;

renderUser();

const deleteUser = (userId) => {
  users = users.filter((user) => user.id !== userId);
  renderUser();
};

const editUser = (userId) => {
  const userToEdit = users.find((user) => user.id === userId);

  const indexOfEditingUser = users.findIndex((user) => user.id === userId);

  changeUser = { data: userToEdit, index: indexOfEditingUser };

  createBtn.textContent = "Save changes";

  nameInput.value = changeUser.data.name;
  ageInput.value = changeUser.data.age;
  city.value = changeUser.data.city;
};

function renderPagination(usersQuantity) {
  paginationSection.innerHTML = "";

  for (let i = 0; i < usersQuantity / 3; i++) {
    const btnPgn = document.createElement("button");
    btnPgn.classList.add("btn-pgn");
    btnPgn.textContent = i;
    btnPgn.onclick = () => {
      paginationpagenumber = i;
      const groupedUsers = groupOfUsers(users, 3);

      renderUser();
    };
    paginationSection.appendChild(btnPgn);
  }
}

const sorting = {
  names: () => {
    const usersCopy = [...users];
    usersCopy.sort((user1, user2) => user1.name.localeCompare(user2.name));

    renderUser(usersCopy);
  },
  ages: () => {
    const usersCopy = [...users];
    usersCopy.sort((user1, user2) => +user1.age - +user2.age);
    renderUser(usersCopy);
  },
};

function renderUser(
  usersToRender = groupOfUsers(users, 3)[paginationpagenumber]
) {
  renderPagination(users.length);
  userSection.innerHTML = "";

  const usersContent = usersToRender.map(
    (user) =>
      `<div class="user-card">
   <p>${user.name}</p>
   <span>${user.age}</span>
   <p>${user.city}</p>
   <button class="delete-user-btn" id = "${user.id}">Delete</button>
   <button class="edit-user-btn"  id = "${user.id}">Edit</button>
   </div>`
  );

  usersContent.forEach((userLayout) => {
    userSection.innerHTML += userLayout;
  });

  const deleteBtn = [...document.querySelectorAll(".delete-user-btn")];

  deleteBtn.forEach((btn) => {
    btn.onclick = () => deleteUser(btn.id);
  });

  const editBtn = [...document.querySelectorAll(".edit-user-btn")];

  editBtn.forEach((btn) => {
    btn.onclick = () => editUser(btn.id);
  });
}

createBtn.onclick = () => {
  const name = nameInput.value;
  const age = +ageInput.value;
  const city = userCity.value;

  if (!name || !age || !city) {
    return alert("Please, fill in all fields");
  }

  if (changeUser) {
    users[changeUser.index] = {
      ...users[changeUser.index],
      name: name,
      age: age,
      city: city,
    };

    changeUser = undefined;
    createBtn.textContent = "Create User";
  } else {
    const user = { id: generateId(), name: name, age: age, city: city };

    users.push(user);
  }

  nameInput.value = "";
  ageInput.value = "";
  userCity.value = "";

  renderUser();
};


searchInput.oninput = (event) => {
  if (!event.target.value) return renderUser();

  const usersToRender = users.filter(({ name, age, city }) =>
    [name, age.toString(), city].some((element) =>
      element.includes(event.target.value)
    )
  );

  renderUser(usersToRender);
};

sortingByNameCheckBox.onchange = (event) => {
  if (event.target.checked) {
    sorting.names();
    sortingByAgeCheckBox.checked = false;
  } else {
    renderUser();
  }
};

sortingByAgeCheckBox.onchange = (event) => {
  if (event.target.checked) {
    sorting.ages();
    sortingByNameCheckBox.checked = false;
  } else {
    renderUser();
  }
};


function groupOfUsers(arr, quantityOfUsers) {
  const result = [];

  for (let i = 0; i < arr.length; i++) {
    result.push(arr.slice(i * quantityOfUsers, (i + 1) * quantityOfUsers));
  }

  return result.filter((arr) => arr.length > 0);
};