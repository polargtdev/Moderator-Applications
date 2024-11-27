const CLIENT_ID = '1311230025475035187';
const REDIRECT_URI = 'https://moderator-applications.vercel.app/';
const CLIENT_SECRET = '9_TOaWW7TbHl14ql5eTcBDW8sbBDstK7'; // Replace with your actual client secret
const SCOPE = 'identify';

function authenticateWithDiscord() {
    const authUrl = `https://discord.com/oauth2/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${SCOPE}`;
    window.location.href = authUrl;
}

document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const authorizationCode = urlParams.get('code');
    console.log('Authorization Code:', authorizationCode); // Debug authorization code

    if (authorizationCode) {
        const tokenData = await fetchToken(authorizationCode);
        if (tokenData) {
            const userData = await fetchUserInfo(tokenData.access_token);
            if (userData) {
                displayUserInfo(userData);
            }
        }
    }
});

async function fetchToken(code) {
    try {
        const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: REDIRECT_URI,
            }),
        });

        if (tokenResponse.ok) {
            const tokenData = await tokenResponse.json();
            console.log('Token Data:', tokenData); // Debug token data
            return tokenData;
        } else {
            console.error('Token Exchange Failed:', await tokenResponse.text());
        }
    } catch (error) {
        console.error('Error during token exchange:', error);
    }
}

async function fetchUserInfo(accessToken) {
    try {
        const userInfoResponse = await fetch('https://discord.com/api/users/@me', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (userInfoResponse.ok) {
            const userData = await userInfoResponse.json();
            console.log('User Data:', userData); // Debug user data
            return userData;
        } else {
            console.error('User Info Fetch Failed:', await userInfoResponse.text());
        }
    } catch (error) {
        console.error('Error fetching user info:', error);
    }
}

function displayUserInfo(user) {
    const userInfoElement = document.getElementById('user-info');
    userInfoElement.classList.remove('hidden');
    document.getElementById('user-avatar').src = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`;
    document.getElementById('user-name').textContent = `${user.username}#${user.discriminator}`;
    document.getElementById('login-button').classList.add('hidden');
    document.getElementById('begin-button').classList.remove('hidden');
}
