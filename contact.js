(function () {
  var form = document.getElementById('contactForm');
  var status = document.getElementById('contactStatus');
  if (!form || !status) return;

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    status.textContent = 'Sending...';

    var payload = {
      name: document.getElementById('contactName').value.trim(),
      email: document.getElementById('contactEmail').value.trim(),
      message: document.getElementById('contactMessage').value.trim()
    };

    fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(function (res) {
        return res.json().then(function (data) {
          if (!res.ok) throw new Error(data.error || 'Failed to send');
          return data;
        });
      })
      .then(function () {
        form.reset();
        status.textContent = 'Message saved successfully.';
      })
      .catch(function (err) {
        status.textContent = err.message;
      });
  });
})();
