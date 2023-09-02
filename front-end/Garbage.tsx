const fetchDynamics365Data = async () => {
    const clientId = 'd739fcbe-d91c-4f0f-9b08-09a221407b43'; // Replace with your Azure AD application's client ID
    const clientSecret = 'ofA8Q~.WYEda62CRIlDe0CzShhXXkbmy2AX7AbmY'; // Replace with your Azure AD application's client secret
    const resource = 'https://giftregistrydev0060814101be5bd3devaos.axcloud.dynamics.com'; // Replace with your Dynamics 365 instance URL
    const url = `${resource}/data/GROccasionTypes`; // Replace with the appropriate API endpoint
  
    const tokenEndpoint = `https://login.microsoftonline.com/0e8d2334-91d0-4323-b565-4041eccffadb/oauth2/token`; // Replace with your Azure AD tenant ID
    // https://login.microsoftonline.com/0e8d2334-91d0-4323-b565-4041eccffadb/oauth2/token
    //Request an access token
    const tokenResponse = await fetch(tokenEndpoint, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `grant_type=client_credentials&client_id=${clientId}&client_secret=${clientSecret}&resource=${resource}`,
    }).then(res => res.json())
    .catch((error) => {
      console.error('Error obtaining access token:', error);
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
      }
    });
  
    if (!tokenResponse.ok) {
      throw new Error('Failed to obtain access token');
    }
  
    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;
  
    // Use the access token to make a request to Dynamics 365
    const dynamicsDataResponse = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  
    if (!dynamicsDataResponse.ok) {
      // throw new Error('Failed to fetch Dynamics 365 data');
      console.log('ERROR', dynamicsDataResponse)
    }
  
    const dynamicsData = await dynamicsDataResponse.json();
    console.log('DYNAMICS::', dynamicsData)
    return dynamicsData;
  };
useEffect(()=> {
  fetchDynamics365Data()
      .then((result) => {
        console.log('RES::', result)
      })
      .catch((error) => {
        console.error('Error fetching Dynamics 365 data:', error);
      });
}, [])  