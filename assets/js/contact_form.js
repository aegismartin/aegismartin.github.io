document.getElementById('contact-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    const form = e.target;
    const button = form.querySelector('.btn-submit');
    button.textContent = 'Sending...';
    button.disabled = true;

    try {
        // Step 1: validate Turnstile via Worker
        const validation = await fetch('https://summer-cell-fde7.martinsimonyan2563.workers.dev', {
            method: 'POST',
            body: new FormData(form)
        });

        if (!validation.ok) {
            alert('Security check failed. Please try again.');
            button.textContent = 'Contact Aegis Martin';
            button.disabled = false;
            return;
        }

        // Step 2: POST directly to Formspree from browser (looks legitimate)
        const formData = new FormData(form);
        const res = await fetch('https://formspree.io/f/mqedkvbp', {
            method: 'POST',
            body: formData,
            headers: { 'Accept': 'application/json' }
        });

        if (res.ok) {
            window.location.href = '/thankyou.html';
        } else {
            alert('Something went wrong. Please try again.');
            button.textContent = 'Contact Aegis Martin';
            button.disabled = false;
        }

    } catch (err) {
        alert('Network error. Please check your connection and try again.');
        button.textContent = 'Contact Aegis Martin';
        button.disabled = false;
    }
});