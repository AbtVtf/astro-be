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

// testRegister();
// testRegister()
// testLogin()
// testDrawTarotCards();
// testDailyAffirmation()

(async () => {
  const token = await testLogin(); 
  testDailyAffirmation(token); 
  testDrawTarotCards(token)
})();