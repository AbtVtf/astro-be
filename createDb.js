
var mysql = require('mysql2/promise');
var dotenv = require('dotenv');

dotenv.config();

const zodiacs_crystals = [
    ['Aries', 'Red Jasper'],
    ['Aries', 'Bloodstone'],
    ['Aries', 'Carnelian'],
    ['Aries', 'Diamond'],
    
    ['Taurus', 'Rose Quartz'],
    ['Taurus', 'Emerald'],
    ['Taurus', 'Lapis Lazuli'],
    ['Taurus', 'Tiger\'s Eye'],
    
    ['Gemini', 'Agate'],
    ['Gemini', 'Citrine'],
    ['Gemini', 'Aquamarine'],
    ['Gemini', 'Tiger\'s Eye'],
    
    ['Cancer', 'Moonstone'],
    ['Cancer', 'Pearl'],
    ['Cancer', 'Rose Quartz'],
    ['Cancer', 'Rhodonite'],
    
    ['Leo', 'Sunstone'],
    ['Leo', 'Tiger\'s Eye'],
    ['Leo', 'Citrine'],
    ['Leo', 'Garnet'],
    
    ['Virgo', 'Amazonite'],
    ['Virgo', 'Peridot'],
    ['Virgo', 'Citrine'],
    ['Virgo', 'Moss Agate'],
    
    ['Libra', 'Lepidolite'],
    ['Libra', 'Rose Quartz'],
    ['Libra', 'Prehnite'],
    ['Libra', 'Opal'],
    
    ['Scorpio', 'Malachite'],
    ['Scorpio', 'Obsidian'],
    ['Scorpio', 'Garnet'],
    ['Scorpio', 'Topaz'],
    
    ['Sagittarius', 'Sodalite'],
    ['Sagittarius', 'Turquoise'],
    ['Sagittarius', 'Lapis Lazuli'],
    ['Sagittarius', 'Blue Topaz'],
    
    ['Capricorn', 'Garnet'],
    ['Capricorn', 'Black Tourmaline'],
    ['Capricorn', 'Smoky Quartz'],
    ['Capricorn', 'Jet'],
    
    ['Aquarius', 'Amethyst'],
    ['Aquarius', 'Angelite'],
    ['Aquarius', 'Garnet'],
    ['Aquarius', 'Aquamarine'],
    
    ['Pisces', 'Amethyst'],
    ['Pisces', 'Aquamarine'],
    ['Pisces', 'Moonstone'],
    ['Pisces', 'Bloodstone']
];

const zodiacs = [
    ['Aries', 'March 21', 'April 19'],
    ['Taurus', 'April 20', 'May 20'],
    ['Gemini', 'May 21', 'June 20'],
    ['Cancer', 'June 21', 'July 22'],
    ['Leo', 'July 23', 'August 22'],
    ['Virgo', 'August 23', 'September 22'],
    ['Libra', 'September 23', 'October 22'],
    ['Scorpio', 'October 23', 'November 21'],
    ['Sagittarius', 'November 22', 'December 21'],
    ['Capricorn', 'December 22', 'January 19'],
    ['Aquarius', 'January 20', 'February 18'],
    ['Pisces', 'February 19', 'March 20'],
  ];

const crystals = [
    ['Red Jasper', 'Red Jasper is known as a stone of endurance, imparting strength and energy to its bearer. It is often associated with Aries due to its grounding and stimulating energies. It is said to foster focus and determination, helping in setting and achieving goals, attributes that align well with the ambitious nature of Aries.'],
    ['Bloodstone', 'Bloodstone, also known as Heliotrope, is cherished for its alleged ability to purify and fortify the blood. It is linked to Aries due to its revitalizing properties, helping to build resilience and courage. Bloodstone is believed to balance the energies and revitalize the body and mind when exhausted.'],
    ['Carnelian', 'Carnelian, with its bold, energizing hues, is said to stimulate motivation and endurance, resonating with the dynamic and pioneering spirit of Aries. It is believed to boost confidence and the power of true expression, making it a favorite for those looking to overcome fear and embrace new challenges.'],
    ['Diamond', 'Diamond, a symbol of purity and strength, is often associated with Aries for its invincible hardness and clarity. It is believed to amplify energy and enhance the properties of other crystals, aligning with the high energy and leadership qualities of Aries.'],
    ['Rose Quartz', 'Rose Quartz, with its gentle pink essence, is a stone of the heart, symbolizing unconditional love and peace. It is connected to Taurus due to its nurturing and comforting vibrations, which align with Taurus’s desire for stability and sensuality. It is known for promoting self-love and emotional healing.'],
    ['Emerald', 'Emerald, a symbol of rebirth and love, is associated with Taurus for its soothing energy that brings freshness and vitality to the spirit. It is said to promote balance, patience, and abundance, reflecting the practical and resourceful nature of Taurus.'],
    ['Lapis Lazuli', 'Lapis Lazuli, known for its deep celestial blue, symbolizes honor, wisdom, and truth. It is linked to both Taurus and Sagittarius due to its ability to foster enlightenment and self-awareness. It is revered for enhancing intellectual ability and stimulating the desire for knowledge, wisdom, and understanding.'],
    ['Tiger\'s Eye', 'Tiger\'s Eye is valued for its grounding and balancing properties, related to both Taurus and Leo. It is believed to harmonize yin and yang energies and to promote clarity and thoughtful action. Its vibrant, earthy appearance resonates with the practical and disciplined nature of Taurus and the dynamic and bold spirit of Leo.'],
    ['Agate', 'Agate is known for its stabilizing and strengthening influence, making it a suitable stone for Gemini. It is believed to balance the intellectual, emotional, and physical energies, aligning well with the versatile and adaptable nature of Gemini. Its varied and layered appearance reflects the multifaceted personality of this sign.'],
    ['Citrine', 'Citrine, known as the stone of abundance and manifestation, is associated with Gemini and Leo due to its warm and comforting energies. It is believed to encourage generosity and sharing, and to help in overcoming fear and obstacles, aligning with the expressive and optimistic nature of these signs.'],
    ['Aquamarine', 'Aquamarine, with its serene, ocean-like hues, is associated with Gemini and Pisces. It is said to calm the mind and reduce stress, resonating with the adaptable and intuitive nature of these signs. It is believed to encourage tolerance and to help overcome judgmentalism.'],
    ['Moonstone', 'Moonstone, known as the stone of new beginnings, is related to Cancer and Pisces due to its soothing and calming energies. It is believed to enhance intuition and to promote inspiration, success, and good fortune in love and business matters. Its mysterious and ethereal appearance aligns with the imaginative and empathetic nature of these signs.'],
    ['Pearl', 'Pearl, symbolizing purity and innocence, is often associated with Cancer. It is said to attract wealth and luck and to provide protection. Its lustrous and soft appearance resonates with the nurturing and protective nature of Cancer.'],
    ['Rhodonite', 'Rhodonite is known for its capacity to bring emotional healing and to release blocked energy from within the heart chakra. It is associated with Cancer due to its nurturing vibrations, promoting love and encouraging the brotherhood of humanity.'],
    ['Sunstone', 'Sunstone is associated with Leo due to its warm, radiant energy reminiscent of the sun. It is believed to foster joy and restore the enjoyment of life, aligning with the vibrant and generous nature of Leo. Sunstone is said to encourage independence and originality.'],
    ['Garnet', 'Garnet, symbolizing passion and love, is associated with Leo, Scorpio, and Aquarius. It is believed to revitalize, purify, and balance energy, bringing serenity or passion as appropriate. Its deep, fiery appearance resonates with the intense and transformative nature of these signs.'],
    ['Amazonite', 'Amazonite is linked to Virgo due to its soothing and harmonizing properties. It is said to balance feminine and masculine energies and to promote kindness and practicality. Its tranquil, refreshing appearance aligns with the analytical and modest nature of Virgo.'],
    ['Peridot', 'Peridot, known as the stone of compassion, is associated with Virgo for its light, friendly energy that is said to enhance confidence and assertiveness. It is believed to stimulate the mind and elevate the spirit, reflecting the meticulous and thoughtful nature of Virgo.'],
    ['Moss Agate', 'Moss Agate is connected to Virgo due to its stabilizing properties. It is said to refresh the soul and enable you to see the beauty in all you behold. Its organic, earthy appearance resonates with the practical and nurturing nature of Virgo.'],
    ['Lepidolite', 'Lepidolite, with its lilac hues, is associated with Libra due to its balancing and soothing energies. It is believed to alleviate stress and dissipate negativity, fostering equilibrium and tranquility, aligning well with the harmonious and diplomatic nature of Libra.'],
    ['Prehnite', 'Prehnite is linked to Libra for its serene, nurturing energy that fosters a strong sense of trust and inner peace. It is believed to enhance precognition and inner knowing, aligning with the balanced and intuitive nature of Libra.'],
    ['Opal', 'Opal, known for its play-of-color, is associated with Libra and its aesthetic appreciation of beauty and the arts. It is said to foster love, passion, and desire, and to intensify emotional states and release inhibitions.'],
    ['Malachite', 'Malachite is connected to Scorpio due to its transformative and healing properties. It is believed to amplify energies, both positive and negative, and to bring to light that which is unseen, aligning with the intense and introspective nature of Scorpio.'],
    ['Obsidian', 'Obsidian is associated with Scorpio for its protective and grounding energies. It is said to form a shield against negativity, to absorb negative energies from the environment, and to draw out mental stress and tension.'],
    ['Topaz', 'Topaz is linked to Scorpio and Sagittarius due to its ability to bring joy, generosity, abundance, and good health. It is known as a stone of love and good fortune and is said to release tension and encourage relaxation.'],
    ['Sodalite', 'Sodalite is associated with Sagittarius for its harmonizing and soothing properties. It is said to encourage rational thought, objectivity, truth, and intuitive perception, along with the verbalization of feelings, aligning with the philosophical and open-minded nature of Sagittarius.'],
    ['Turquoise', 'Turquoise, known as a purification stone, is connected to Sagittarius. It is said to dispel negative energy and can be worn to protect against outside influences or pollutants in the atmosphere. Its balancing and aligning properties resonate well with the adventurous and optimistic spirit of Sagittarius.'],
    ['Black Tourmaline', 'Black Tourmaline is associated with Capricorn due to its grounding and protective properties. It is believed to transform dense energy into a lighter vibration and is used for protection against negative energies. Its shielding and purifying properties align well with the disciplined and prudent nature of Capricorn.'],
    ['Smoky Quartz', 'Smoky Quartz is connected to Capricorn due to its grounding and balancing energies. It is said to gently neutralize negative vibrations and is detoxifying on all levels, prompting elimination of the digestive system and protecting against radiation and electromagnetic smog.'],
    ['Jet', 'Jet is associated with Capricorn for its protective and purifying properties. It is said to draw out negative energy and alleviate unreasonable fears, aligning with the resilient and resourceful nature of Capricorn.'],
    ['Angelite', 'Angelite is linked to Aquarius due to its soothing and uplifting vibrations. It is believed to connect one with the angelic realms and to enhance telepathic communication, aligning with the innovative and humanitarian nature of Aquarius.'],
    ['Amethyst', 'Amethyst, known for its spiritual and calming energies, is associated with Aquarius and Pisces. It is believed to enhance spirituality and consciousness, and to promote emotional balance, making it suitable for meditation and tranquility, resonating with the imaginative and compassionate nature of these signs.']

];

const houses = [
  '1st House', '2nd House', '3rd House', '4th House', 
  '5th House', '6th House', '7th House', '8th House', 
  '9th House', '10th House', '11th House', '12th House'
];

const planets = [
  'Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 
  'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'
];

function runScript() {
  mysql.createConnection({
    host: "containers-us-west-196.railway.app",
    user: "root",
    password: "opPgrkqMMwJFUyepv5Wo",
    database: "railway",
    port: 6676
  })
  .then(function (connection) {
    return connection.execute(`
      CREATE TABLE IF NOT EXISTS zodiacs (
        zodiac_id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        start_date VARCHAR(255) NOT NULL,
        end_date VARCHAR(255) NOT NULL
      )
    `)
    .then(function () {
      return connection.execute(`
        CREATE TABLE IF NOT EXISTS crystals (
          crystal_id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          description TEXT NOT NULL
        )
      `);
    })
    .then(function () {
      return connection.execute(`
        CREATE TABLE IF NOT EXISTS zodiacs_crystals (
          zodiac_id INT,
          crystal_id INT,
          PRIMARY KEY(zodiac_id, crystal_id),
          FOREIGN KEY(zodiac_id) REFERENCES zodiacs(zodiac_id),
          FOREIGN KEY(crystal_id) REFERENCES crystals(crystal_id)
        )
      `);
    })
    .then(function () {
      var promises = zodiacs.map(function (zodiac) {
        var name = zodiac[0];
        var start_date = zodiac[1];
        var end_date = zodiac[2];
        return connection.execute('INSERT IGNORE INTO zodiacs(name, start_date, end_date) VALUES(?, ?, ?)', [name, start_date, end_date]);
      });

      return Promise.all(promises);
    })
    .then(function () {
      var promises = crystals.map(function (crystal) {
        var name = crystal[0];
        var description = crystal[1];
        return connection.execute('INSERT IGNORE INTO crystals(name, description) VALUES(?, ?)', [name, description]);
      });

      return Promise.all(promises);
    })
    .then(function () {
      var promises = zodiacs_crystals.map(function (zodiac_crystal) {
        var zodiac_name = zodiac_crystal[0];
        var crystal_name = zodiac_crystal[1];
        return connection.execute(`
          INSERT IGNORE INTO zodiacs_crystals(zodiac_id, crystal_id)
          SELECT z.zodiac_id, c.crystal_id
          FROM zodiacs z, crystals c
          WHERE z.name = ? AND c.name = ?
        `, [zodiac_name, crystal_name]);
      });

      return Promise.all(promises);
    })
    .then(function () {
      console.log('Data has been inserted successfully.');
    })
    .catch(function (error) {
      console.error('Error:', error);
    })
    .finally(function () {
      return connection.end();
    });
  });
}

async function createTables() {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: 'containers-us-west-115.railway.app',
      user: 'root',
      password: 'ydzcJ1EnCClnaRHzYxjx',
      database: 'railway',
      port: '7017',
    });

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        user_id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL
      )
    `);

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS user_zodiacs (
        user_id INT,
        zodiac_id INT,
        PRIMARY KEY(user_id, zodiac_id),
        FOREIGN KEY(user_id) REFERENCES users(user_id),
        FOREIGN KEY(zodiac_id) REFERENCES zodiacs(zodiac_id)
      )
    `);

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS user_crystals (
        user_id INT,
        crystal_id INT,
        PRIMARY KEY(user_id, crystal_id),
        FOREIGN KEY(user_id) REFERENCES users(user_id),
        FOREIGN KEY(crystal_id) REFERENCES crystals(crystal_id)
      )
    `);

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS affirmations (
        affirmation_id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        affirmation_text TEXT NOT NULL,
        FOREIGN KEY(user_id) REFERENCES users(user_id)
      )
    `);

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS tarot_readings (
        reading_id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        card_name VARCHAR(255) NOT NULL,
        card_interpretation TEXT NOT NULL,
        FOREIGN KEY(user_id) REFERENCES users(user_id)
      )
    `);

    console.log('Tables created successfully.');
  } catch (error) {
    console.error('Error creating tables:', error);
  } finally {
    if (connection) connection.end();
  }
}

async function createTables2() {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: 'containers-us-west-196.railway.app',
      user: 'root',
      password: 'opPgrkqMMwJFUyepv5Wo',
      database: 'railway',
      port: '6676',
    });

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS houses (
        house_id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL
      )
    `);
        
    for (const house of houses) {
      await connection.execute('INSERT IGNORE INTO houses(name) VALUES(?)', [house]);
    }

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS planets (
        planet_id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL
      )
    `);
      
    for (const planet of planets) {
      await connection.execute('INSERT IGNORE INTO planets(name) VALUES(?)', [planet]);
    }

    console.log('Tables created and populated successfully.');
  } catch (error) {
    console.error('Error creating and populating tables:', error);
  } finally {
    if (connection) connection.end();
  }
}

async function createTables3() {
  try {
    const connection = await mysql.createConnection({
      host: "containers-us-west-196.railway.app",
      user: "root",
      password: "opPgrkqMMwJFUyepv5Wo",
      database: "railway",
      port: 6676
    });
  
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS planetary_positions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        planet_id INT,
        sign_no INT,
        house_id INT,
        interpretation TEXT,
        FOREIGN KEY (user_id) REFERENCES users(user_id),
        FOREIGN KEY (planet_id) REFERENCES planets(planet_id),
        FOREIGN KEY (house_id) REFERENCES houses(house_id)
      );
    `);
    console.log('Tables created successfully.');
  } catch (error) {
    console.error('Error creating tables:', error);
  }
}

createTables3()