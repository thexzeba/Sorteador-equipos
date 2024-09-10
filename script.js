// Cargar el archivo JSON de equipos
fetch('teams.json')
    .then(response => response.json())
    .then(data => {
        const teams = data;
        let firstTeamSelected = false;
        let firstTeamOverall = null; // Guardamos el overall del primer equipo
        let team1 = null; // Guardamos el primer equipo seleccionado

        // Evento para limpiar los filtros
        document.getElementById('clearFiltersBtn').addEventListener('click', () => {
            const checkboxes = document.querySelectorAll('#leagueFilters input[type="checkbox"]');
            checkboxes.forEach(checkbox => {
                checkbox.checked = false; // Desmarcar cada checkbox
            });
        });
        document.getElementById('nextTeamBtn').addEventListener('click', () => {
            const selectedLeagues = getSelectedLeagues(); // Obtenemos las ligas seleccionadas
            const filteredTeams = filterTeamsByLeague(teams, selectedLeagues); // Filtrar los equipos por las ligas seleccionadas

            if (!firstTeamSelected) {
                // Animación tipo ruleta para seleccionar el primer equipo
                startRoulette(filteredTeams, 'team1', (selectedTeam) => {
                    team1 = selectedTeam;
                    firstTeamOverall = team1.overall; // Guardamos el overall del primer equipo
                    firstTeamSelected = true; // Indicamos que ya se seleccionó el primer equipo
                });
            } else {
                // Selecciona el segundo equipo con un overall similar al primero y que no sea el mismo equipo
                let team2;
                do {
                    team2 = getRandomTeamWithinRange(filteredTeams, firstTeamOverall);
                } while (team1 && team2.team_name === team1.team_name); // Repetimos si el equipo es el mismo
                
                startRoulette(filteredTeams, 'team2', (selectedTeam) => {
                    displayTeamData(team2, 'team2');
                    firstTeamSelected = false; // Reiniciamos para el siguiente emparejamiento
                });
            }
        });
        // Función para seleccionar las ligas grandes
document.getElementById('selectBigLeaguesBtn').addEventListener('click', () => {
    const bigLeagues = ["Premier League", "La Liga", "Bundesliga", "Serie A", "Ligue 1"];
    const checkboxes = document.querySelectorAll('#leagueFilters input[type="checkbox"]');

    checkboxes.forEach(checkbox => {
        if (bigLeagues.includes(checkbox.value)) {
            checkbox.checked = true; // Seleccionar las ligas grandes
        }
    });
});
        // Función para iniciar la animación de ruleta
        function startRoulette(teams, teamId, callback) {
            let index = 0;
            const intervalTime = 100; // Intervalo de cambio en milisegundos
            const spinDuration = 1000; // Duración total de la "ruleta" en milisegundos

            // Iniciar el cambio rápido de equipos
            const interval = setInterval(() => {
                const currentTeam = teams[index % teams.length]; // Cambia el equipo
                displayTeamData(currentTeam, teamId);
                index++;
            }, intervalTime);

            // Detener la ruleta después de un tiempo y seleccionar el equipo definitivo
            setTimeout(() => {
                clearInterval(interval); // Detener la animación
                const selectedTeam = teams[Math.floor(Math.random() * teams.length)]; // Seleccionar un equipo al azar
                callback(selectedTeam); // Ejecutar el callback con el equipo final
                displayTeamData(selectedTeam, teamId); // Mostrar el equipo seleccionado
            }, spinDuration);
        }

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
            document.getElementById(`${teamId}-name`).textContent = team.team_name || "No disponible";
            document.getElementById(`${teamId}-overall`).textContent = team.overall || "No disponible";
            document.getElementById(`${teamId}-attack`).textContent = team.attack || "No disponible";
            document.getElementById(`${teamId}-midfield`).textContent = team.midfield || "No disponible";
            document.getElementById(`${teamId}-defence`).textContent = team.defence || "No disponible";
            document.getElementById(`${teamId}-league`).textContent = team.league_name || "No disponible";
            document.getElementById(`${teamId}-nationality`).textContent = team.nationality_name || "No disponible";
        }
    })
    .catch(error => console.error('Error al cargar los equipos:', error));
