async function testGet() {
  try {
    const response = await fetch('http://localhost:3000/api/weaponConfigs');
    const data = await response.json();
    console.log('GET Status:', response.status);
    console.log('GET Response:', data);
  } catch (error) {
    console.error('GET Error:', error);
  }
}

async function testPost() {
  const config = {
    username: 'TestUser',
    weaponCode: 'Fuzil de combate M7-Zona de Risco-6I0B15G0EOJQS9KCRND3K',
    weaponType: 'Fuzil de combate',
    weaponName: 'M7',
    gameMode: 'Conflicto Bélico',
    rangeType: ['Corto Alcance']
  };

  try {
    const response = await fetch('http://localhost:3000/api/weaponConfigs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config)
    });
    const data = await response.json();
    console.log('POST Status:', response.status);
    console.log('POST Response:', data);
  } catch (error) {
    console.error('POST Error:', error);
  }
}

testGet().then(() => testPost());