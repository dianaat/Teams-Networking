function loadTeams() {
  fetch("data/teams.json")
    .then(function (response) {
      return response.json();
    })
    .then(function (teams) {
      displayTeams(teams);
    });
}

function displayTeams(teams) {
  for (i = 0; i < teams.length; i++) {
    console.log(teams[i]);
    document.getElementById("tbody").innerHTML += `<tr>
      <td>${teams[i].promotion}</td>
      <td>${teams[i].members}</td>
      <td>${teams[i].name}</td>
      <td><a href="${teams[i].url}">link</a></td>
    </tr>`;
  }
}

loadTeams();
