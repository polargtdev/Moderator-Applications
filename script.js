document.getElementById('begin-button').addEventListener('click', () => {
    document.getElementById('start-screen').classList.add('hidden');
    document.getElementById('application-screen').classList.remove('hidden');
});

document.getElementById('cancel-button').addEventListener('click', () => {
    alert('Cancelled');
});

document.getElementById('application-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const webhookUrl = 'YOUR_DISCORD_WEBHOOK_URL';
    const formData = new FormData(e.target);

    const embedFields = [];
    formData.forEach((value, key) => {
        if (key === 'strengths') {
            embedFields.push({
                name: key,
                value: Array.isArray(value) ? value.join(', ') : value,
                inline: false
            });
        } else {
            embedFields.push({ name: key, value: value, inline: false });
        }
    });

    const payload = {
        embeds: [
            {
                title: 'New Moderator Application',
                color: 3447003,
                fields: embedFields
            }
        ]
    };

    try {
        await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
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
