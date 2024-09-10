// Cargar el archivo JSON de equipos
fetch('teams.json')
    .then(response => response.json())
    .then(data => {
        const teams = data;
        let firstTeamSelected = false;
        let firstTeamOverall = null; // Guardamos el overall del primer equipo
        let team1 = null; // Guardamos el primer equipo seleccionado

        document.getElementById('nextTeamBtn').addEventListener('click', () => {
            const selectedLeagues = getSelectedLeagues(); // Obtenemos las ligas seleccionadas
            const filteredTeams = filterTeamsByLeague(teams, selectedLeagues); // Filtrar los equipos por las ligas seleccionadas

            if (!firstTeamSelected) {
                // Selecciona el primer equipo aleatorio dentro del filtro de ligas
                team1 = getRandomTeam(filteredTeams);
                displayTeamData(team1, 'team1');
                firstTeamOverall = team1.overall; // Guardamos el overall del primer equipo
                firstTeamSelected = true; // Indicamos que ya se seleccionó el primer equipo
            } else {
                // Selecciona el segundo equipo con un overall similar al primero y que no sea el mismo equipo
                let team2;
                do {
                    team2 = getRandomTeamWithinRange(filteredTeams, firstTeamOverall);
                } while (team1 && team2.team_name === team1.team_name); // Repetimos si el equipo es el mismo
                displayTeamData(team2, 'team2');
                firstTeamSelected = false; // Reiniciamos para el siguiente emparejamiento
            }
        });

        // Función para obtener las ligas seleccionadas de los checkboxes
        function getSelectedLeagues() {
            const checkboxes = document.querySelectorAll('#leagueFilters input[type="checkbox"]:checked');
            const selectedLeagues = Array.from(checkboxes).map(checkbox => checkbox.value);
            return selectedLeagues;
        }

        // Filtrar los equipos por ligas seleccionadas
        function filterTeamsByLeague(teams, selectedLeagues) {
            if (selectedLeagues.length === 0) {
                return teams; // Si no se selecciona ninguna liga, usar todos los equipos
            }
            // Filtrar los equipos que pertenezcan a las ligas seleccionadas (aseguramos que no haya espacios adicionales)
            return teams.filter(team => selectedLeagues.includes(team.league_name.trim()));
        }

        // Función para seleccionar un equipo aleatorio
        function getRandomTeam(teams) {
            const randomIndex = Math.floor(Math.random() * teams.length);
            return teams[randomIndex];
        }

        // Función para seleccionar un equipo con "overall" dentro de un rango similar
        function getRandomTeamWithinRange(teams, referenceOverall) {
            const acceptableRange = 2; // Rango aceptable de diferencia de overall (puedes ajustarlo)
            const filteredTeams = teams.filter(team => 
                Math.abs(team.overall - referenceOverall) <= acceptableRange
            );
            
            // Si no hay equipos en el rango, volvemos a seleccionar de todos (para evitar errores)
            if (filteredTeams.length === 0) {
                return getRandomTeam(teams);
            }
            
            const randomIndex = Math.floor(Math.random() * filteredTeams.length);
            return filteredTeams[randomIndex];
        }
        document.getElementById('clearFiltersBtn').addEventListener('click', () => {
            const checkboxes = document.querySelectorAll('#leagueFilters input[type="checkbox"]');
            checkboxes.forEach(checkbox => checkbox.checked = false);
        });
        document.getElementById('selectBigLeaguesBtn').addEventListener('click', () => {
            const bigLeagues = ["Premier League", "La Liga", "Bundesliga", "Serie A", "Ligue 1"];
            const checkboxes = document.querySelectorAll('#leagueFilters input[type="checkbox"]');
        
            checkboxes.forEach(checkbox => {
                if (bigLeagues.includes(checkbox.value)) {
                    checkbox.checked = true; // Seleccionar las ligas grandes
                }
            });
        });
        // Función para mostrar los datos del equipo seleccionado
        function displayTeamData(team, teamId) {
            document.getElementById(`${teamId}-name`).textContent = team.team_name;
            document.getElementById(`${teamId}-overall`).textContent = team.overall;
            document.getElementById(`${teamId}-attack`).textContent = team.attack;
            document.getElementById(`${teamId}-midfield`).textContent = team.midfield;
            document.getElementById(`${teamId}-defence`).textContent = team.defence;
            document.getElementById(`${teamId}-league`).textContent = team.league_name;  // Mostrar la liga
            document.getElementById(`${teamId}-nationality`).textContent = team.nationality_name;  // Mostrar el país
        }
    })
    .catch(error => console.error('Error al cargar los equipos:', error));
