class Match {
    constructor(matchday, hometeam, awayteam, homepoints, awaypoints, homelogo, awaylogo, date) {
        this.matchday = matchday;
        this.hometeam = hometeam;
        this.awayteam = awayteam;
        this.homepoints = homepoints;
        this.awaypoints = awaypoints;
        this.homelogo = homelogo;
        this.awaylogo = awaylogo;
        this.date = date;
    }
}

const matches = [];
let index = 0;

function formatDate(isoString) {
    const date = new Date(isoString);  // Create a Date object from the ISO string

    const day = String(date.getDate()).padStart(2, '0'); // Day (two digits)
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month (two digits, months are zero-based)
    const year = date.getFullYear(); // Year
    const hours = String(date.getHours()).padStart(2, '0'); // Hour (two digits)
    const minutes = String(date.getMinutes()).padStart(2, '0'); // Minutes (two digits)

    return `${day}/${month}/${year} ${hours}:${minutes}`; // Format: dd/mm/yyyy hh:mm
}

async function loadMatches() {
    try {

        const response = await fetch(*insert filepath*);
        if (!response.ok) throw new Error("Error loading the file");

        const jsonData = await response.json();

        let isCurrentMatchday = false;

        if (jsonData.matches && jsonData.matches.length > 0) {
            for (let match of jsonData.matches) {
                if(match.matchday === match.season.currentMatchday){
                    let tmp = new Match(
                        match.season.currentMatchday,
                        match.homeTeam.name,
                        match.awayTeam.name,
                        match.score.fullTime.home,
                        match.score.fullTime.away,
                        match.homeTeam.crest,
                        match.awayTeam.crest,
                        match.utcDate
                    );
                    matches.push(tmp);
                    isCurrentMatchday = true;
                }
                if((match.matchday != match.season.currentMatchday) && isCurrentMatchday){
                    break;
                }

            }

            showGameplan();
        } else {
            console.error("No matches found or data is incorrect");
        }
    } catch (err) {
        console.error('Error loading data:', err);
    }
}

function createTeamContainer(teamType, teamLogo, teamName) {
    const container = document.createElement("div");
    container.className = "team_container";

    const teamInfo = document.createElement("div");
    teamInfo.className = "team_info";
    container.appendChild(teamInfo);

    const teamLabel = document.createElement("p");
    teamLabel.textContent = teamType;
    teamInfo.appendChild(teamLabel);

    const logo = document.createElement("img");
    logo.src = teamLogo || "Bundesliga_logos/Default.png"; // Fallback logo
    logo.alt = teamType.toLowerCase();
    teamInfo.appendChild(logo);

    const name = document.createElement("div");
    name.className = "team_name";
    name.textContent = teamName;
    teamInfo.appendChild(name);

    return container;
}

function showGameplan() {
    if (index >= matches.length) return;

    const container = document.getElementById('sub_container');
    const rotatingContainer = document.createElement("div");
    rotatingContainer.className = 'rotating_container';

    rotatingContainer.style.opacity = 0;

    const playtime = document.createElement("div");
    playtime.className = "playtime";

    playtime.style.opacity = 0;

    container.appendChild(playtime);
    const matchInfo = document.createElement('p');
    matchInfo.textContent = `Matchday: ${matches[index].matchday}`;
    playtime.appendChild(matchInfo);
    container.appendChild(rotatingContainer);

    const date = document.createElement("div");
    date.className = "date";
    date.id = "game_date";
    date.innerText = formatDate(matches[index].date);

    date.style.opacity = 0;

    container.appendChild(date);
    
    const homeTeamContainer = createTeamContainer('Home', matches[index].homelogo, matches[index].hometeam);
    rotatingContainer.appendChild(homeTeamContainer);

    const homePoints = document.createElement("div");
    homePoints.className = "points";
    homePoints.id = "homePoints";
    homePoints.textContent = `${matches[index].homepoints}`;
    rotatingContainer.appendChild(homePoints);

    const minus = document.createElement("p");
    minus.id = "minus";
    minus.innerText = "-";
    rotatingContainer.appendChild(minus);

    const awayPoints = document.createElement("div");
    awayPoints.className = "points";
    awayPoints.id = "awayPoints";
    awayPoints.textContent = `${matches[index].awaypoints}`;
    rotatingContainer.appendChild(awayPoints);

    const awayTeamContainer = createTeamContainer('Away', matches[index].awaylogo, matches[index].awayteam);
    rotatingContainer.appendChild(awayTeamContainer);

    setTimeout(() => {
        rotatingContainer.classList.add('fade-in');
        playtime.classList.add('fade-in');
        date.classList.add('fade-in');
    }, 50);

    setTimeout(() => {
        rotatingContainer.classList.remove('fade-in');
        rotatingContainer.classList.add('fade-out');
        playtime.classList.remove('fade-in');
        playtime.classList.add('fade-out');
        date.classList.remove('fade-in');
        date.classList.add('fade-out');
    }, 3000);

    setTimeout(() => {
        rotatingContainer.remove();
        playtime.remove();
        date.remove();
        index++;
        if (index == matches.length){
            index = 0;
        }
        showGameplan();
    }, 6000);
}

loadMatches();
