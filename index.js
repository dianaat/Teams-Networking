let allTeams = [];
let editId;

function $(selector) {
  return document.querySelector(selector);
}

function loadTeams() {
  fetch("http://localhost:3000/teams-json")
    .then((r) => r.json())
    .then((teams) => {
      allTeams = teams;
      displayTeams(teams);
    });
}

function displayTeams(teams) {
  document.getElementById("tbody").innerHTML = "";
  for (i = 0; i < teams.length; i++) {
    document.getElementById("tbody").innerHTML += `<tr>
      <td>${teams[i].promotion}</td>
      <td>${teams[i].members}</td>
      <td>${teams[i].name}</td>
      <td><a href="${teams[i].url}" target="_blank">link</a></td>
  
      <td> 
        <a href="#" data-id="${teams[i].id}" class="delete-btn">❌</a>
        <a href="#" data-id="${teams[i].id}" class="edit-btn">✏️</a>
      </td> 
    </tr>`;
  }
}

function createTeamRequest(team) {
  return fetch("http://localhost:3000/teams-json/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(team),
  }).then((r) => r.json());
}

function removeTeamRequest(id) {
  return fetch("http://localhost:3000/teams-json/delete", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id: id }),
  }).then((r) => r.json());
}

function updateTeamRequest(team) {
  return fetch("http://localhost:3000/teams-json/update", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(team),
  }).then((r) => r.json());
}

function getFormValues() {
  const promotion = $("input[name=promotion]").value;
  const members = $("input[name=members]").value;
  const name = $("input[name=name]").value;
  const url = $("input[name=url]").value;

  return {
    promotion,
    members,
    name,
    url,
    id: "",
  };
}

function setFormValues(team) {
  $("input[name=promotion]").value = team.promotion;
  $("input[name=members]").value = team.members;
  $("input[name=name]").value = team.name;
  $("input[name=url]").value = team.url;
}

function resetFormValues() {
  $("input[name=promotion]").value = null;
  $("input[name=members]").value = null;
  $("input[name=name]").value = null;
  $("input[name=url]").value = null;
}

function submitForm(e) {
  e.preventDefault();

  const team = getFormValues();

  if (editId) {
    team.id = editId;
    updateTeamRequest(team).then((status) => {
      if (status.success) {
        $("#editForm").reset();
        loadTeams();
      }
    });
  } else {
    createTeamRequest(team).then((status) => {
      if (status.success) {
        $("#editForm").reset();
        loadTeams();
      }
    });
  }

  resetFormValues();
}

function startEditTeam(id) {
  const teams = allTeams.find((team) => team.id === id);
  setFormValues(teams);
  editId = id;
}

function initEvents() {
  $("#search").addEventListener("input", (e) => {
    const search = e.target.value.toLowerCase();
    const teams = allTeams.filter((team) => {
      return team.promotion.toLowerCase().includes(search);
    });
    displayTeams(teams);
  });

  const form = $("#editForm");
  form.addEventListener("submit", submitForm);
  form.addEventListener("reset", () => {
    console.warn("reset");
    editId = undefined;
  });

  form.querySelector("tbody").addEventListener("click", (e) => {
    if (e.target.matches("a.delete-btn")) {
      const id = e.target.getAttribute("data-id");
      removeTeamRequest(id).then((status) => {
        if (status.success) {
          loadTeams();
        }
      });
    } else if (e.target.matches("a.edit-btn")) {
      const id = e.target.getAttribute("data-id");
      startEditTeam(id);
    }
  });
}

loadTeams();
initEvents();
