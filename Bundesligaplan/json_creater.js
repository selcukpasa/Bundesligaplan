import fetch from 'node-fetch'; // Use 'import' instead of 'require'
import fs from 'fs'; // Similarly, import fs

const url = "https://api.football-data.org/v4/competitions/BL1/matches";
const headers = { 'X-Auth-Token': *insert token* };

fetch(url, { method: 'GET', headers: headers })
    .then(response => {
        // Log the status code and response for debugging
        console.log(`Status Code: ${response.status}`);
        
        if (!response.ok) {
            throw new Error(`Failed to fetch match data. Status: ${response.status}`);
        }
        return response.json();
    })
    .then(json => {
        // Save to file
        fs.writeFile(*insert path + file name + .json*, JSON.stringify(json, null, 2), (err) => {
            if (err) {
                console.error('Error writing file:', err);
            } else {
                console.log('File written successfully');
            }
        });
    })
    .catch(error => {
        console.error('Error:', error);
    });
