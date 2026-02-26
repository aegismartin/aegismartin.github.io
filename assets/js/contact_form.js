document.getElementById('contact-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    const form = e.target;
    const button = form.querySelector('.btn-submit');
    button.textContent = 'Sending...';
    button.disabled = true;

    try {
        const res = await fetch('https://summer-cell-fde7.martinsimonyan2563.workers.dev', {
            method: 'POST',
            body: new FormData(form)
        });

        if (res.ok) {
            window.location.href = '/thankyou.html';
        } else {
            const data = await res.json();
            alert('Error: ' + (data.error || 'Something went wrong. Please try again.'));
            button.textContent = 'Contact Aegis Martin';
            button.disabled = false;
        }
    } catch (err) {
        alert('Network error. Please check your connection and try again.');
        button.textContent = 'Contact Aegis Martin';
        button.disabled = false;
    }
});