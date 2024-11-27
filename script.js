// OAuth2 Configuration
const CLIENT_ID = '1311230025475035187';
const REDIRECT_URI = 'https://moderator-applications.vercel.app'; // Replace with your domain for production
const WEBHOOK_URL = 'https://discord.com/api/webhooks/1311226587487670354/bGTgCUNXXQVxGNMmJEYXNX-SbKdfJx5IbthjAWd_icZ42Z-uDlh9pzqZ3tdh6kOsRjT7';
let discordUserData = null;

async function authenticateWithDiscord() {
    const authUrl = `https://discord.com/api/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
        REDIRECT_URI
    )}&response_type=token&scope=identify`;
    window.location.href = authUrl;
}

// Parse Discord OAuth Token from URL
function getDiscordAccessToken() {
    const hash = window.location.hash;
    if (hash && hash.includes('access_token')) {
        const params = new URLSearchParams(hash.substring(1));
        return params.get('access_token');
    }
    return null;
}

// Fetch Discord User Data
async function fetchDiscordUserData(token) {
    const response = await fetch('https://discord.com/api/v10/users/@me', {
        headers: { Authorization: `Bearer ${token}` },
    });
    if (response.ok) {
        return await response.json();
    } else {
        console.error('Failed to fetch Discord user data');
        return null;
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const token = getDiscordAccessToken();
    if (token) {
        discordUserData = await fetchDiscordUserData(token);
        if (discordUserData) {
            alert(`Welcome, ${discordUserData.username}!`);
            document.getElementById('begin-button').disabled = false;
        }
    }
});

// Begin Button Logic
document.getElementById('begin-button').addEventListener('click', () => {
    document.getElementById('start-screen').classList.add('hidden');
    document.getElementById('application-screen').classList.remove('hidden');
});

document.getElementById('cancel-button').addEventListener('click', () => {
    alert('Cancelled');
});

// Application Form Submission
document.getElementById('application-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const embedFields = [];
    formData.forEach((value, key) => {
        if (key === 'strengths') {
            embedFields.push({
                name: key,
                value: Array.isArray(value) ? value.join(', ') : value,
                inline: false,
            });
        } else {
            embedFields.push({ name: key, value: value, inline: false });
        }
    });

    const embedPayload = {
        embeds: [
            {
                title: 'New Moderator Application',
                color: 3447003,
                fields: embedFields,
                footer: {
                    text: `Submitted by ${discordUserData.username}#${discordUserData.discriminator}`,
                    icon_url: `https://cdn.discordapp.com/avatars/${discordUserData.id}/${discordUserData.avatar}.png`,
                },
            },
        ],
    };

    try {
        await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(embedPayload),
        });
        alert('Application submitted successfully!');
        e.target.reset();
        document.getElementById('start-screen').classList.remove('hidden');
        document.getElementById('application-screen').classList.add('hidden');
    } catch (error) {
        alert('Failed to submit application.');
        console.error(error);
    }
});
