const CLIENT_ID = '1311230025475035187';
const REDIRECT_URI = 'https://moderator-applications.vercel.app/';
const SCOPE = 'identify';

function authenticateWithDiscord() {
    const authUrl = `https://discord.com/oauth2/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${SCOPE}`;
    window.location.href = authUrl;
}

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const authorizationCode = urlParams.get('code');

    if (authorizationCode) {
        console.log('Authorization Code:', authorizationCode);
        fetchUserData(authorizationCode);
    }
});

async function fetchUserData(code) {
    try {
        const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                client_id: CLIENT_ID,
                client_secret: 'YOUR_CLIENT_SECRET', // Replace with your client secret
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: REDIRECT_URI,
            }),
        });

        if (tokenResponse.ok) {
            const tokenData = await tokenResponse.json();
            console.log('Access Token Data:', tokenData);

            const userInfoResponse = await fetch('https://discord.com/api/users/@me', {
                headers: {
                    Authorization: `Bearer ${tokenData.access_token}`,
                },
            });

            if (userInfoResponse.ok) {
                const userData = await userInfoResponse.json();
                console.log('User Data:', userData);
                displayUserInfo(userData);
            } else {
                console.error('Failed to fetch user info:', await userInfoResponse.text());
            }
        } else {
            console.error('Failed to fetch access token:', await tokenResponse.text());
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
    }
}

function displayUserInfo(user) {
    document.getElementById('user-info').classList.remove('hidden');
    document.getElementById('user-avatar').src = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`;
    document.getElementById('user-name').textContent = `${user.username}#${user.discriminator}`;
    document.getElementById('begin-button').classList.remove('hidden');
}
