const axios = require('axios');

async function testDrawTarotCards(token) {
  try {
    const numberOfCards = 3;
    const response = await axios.get(`http://localhost:3000/api/draw-tarot-cards/${numberOfCards}`,{headers: {
      Authorization: `Bearer ${token}` 
    }});
    console.log('Cards:', response.data);
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

async function testDailyAffirmation(token) {
  try {
    const response = await axios.get('http://localhost:3000/api/daily-affirmation', {
      headers: {
        Authorization: `Bearer ${token}` 
      }
    });
    console.log('Affirmation:', response.data);
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

async function testRegister() {
  try {
    const user = {
      username: 'testuser2',
      email: 'testuser2@example.com',
      password: 'testpassword'
    };
    
    const response = await axios.post('http://localhost:3000/api/register', user);
    console.log('Registered User:', response.data);
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

async function testLogin() {
  try {
    const credentials = {
      username: 'testuser',
      password: 'testpassword'
    };
    
    const response = await axios.post('http://localhost:3000/api/login', credentials);
    console.log('Login Token:', response.data);
    return response.data.token; 
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

async function testPlanetaryPositions(token) {
  try {
    const params = {
      full_name: "John Doe",
      place: "New York, USA",
      gender: "male",
      day: "15",
      month: "06",
      year: "1995",
      hour: "12",
      min: "30",
      sec: "00",
      lon: "-74.006",
      lat: "40.7128",
      tzone: "5.5",
    };
    
    const response = await axios.post('http://localhost:3000/api/get-planetary-positions', params,  {
      headers: {
        Authorization: `Bearer ${token}` 
      }
    }
    );
    console.log('Planetary Positions:', response.data);
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

async function testGetUserPlanetaryPositions(token) {
  try {
    const response = await axios.get('http://localhost:3000/api/user/planetary-positions', {
      headers: {
        Authorization: `Bearer ${token}` 
      }
    });
    console.log('User Planetary Positions:', response.data);
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

(async () => {
  const token = await testLogin(); 
  // testDailyAffirmation(token); 
  // testDrawTarotCards(token);
  testPlanetaryPositions(token); 
  // testGetUserPlanetaryPositions(token);
})();
