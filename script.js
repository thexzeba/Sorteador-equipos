// Cargar el archivo JSON de equipos
fetch('teams.json')
    .then(response => response.json())
    .then(data => {
        const teams = data;
        let firstTeamSelected = false;
        let firstTeamOverall = null; // Guardamos el overall del primer equipo
        let team1 = null; // Guardamos el primer equipo seleccionado

        document.getElementById('nextTeamBtn').addEventListener('click', () => {
            if (!firstTeamSelected) {
                // Selecciona el primer equipo aleatorio
                team1 = getRandomTeam(teams);
                displayTeamData(team1, 'team1');
                firstTeamOverall = team1.overall; // Guardamos el overall del primer equipo
                firstTeamSelected = true; // Indicamos que ya se seleccionó el primer equipo
            } else {
                // Selecciona el segundo equipo con un overall similar al primero
                const team2 = getRandomTeamWithinRange(teams, firstTeamOverall);
                // Evita que el segundo equipo sea igual al primero
                if (team1 && team2.team_name === team1.team_name) {
                    const team2 = getRandomTeamWithinRange(teams, firstTeamOverall); // Selecciona nuevamente
                }
                displayTeamData(team2, 'team2');
                firstTeamSelected = false; // Reiniciamos para el siguiente emparejamiento
            }
        });

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
