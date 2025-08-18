async function subscribe(e) {
  e.preventDefault();
  const form = e.target;
  const status = document.getElementById('formStatus') || createStatusBelow(form);
  status.textContent = 'Enviando…';

  const email = form.email.value.trim();
  const listId = Number(form.dataset.listId || document.getElementById('subscribeForm')?.dataset.listId);
  if (!email || !listId) {
    status.textContent = 'Erro: e-mail ou lista inválidos.';
    return false;
  }
  
  grecaptcha.ready(async function() {
    const token = await grecaptcha.execute('6LcfnqorAAAAAB-ecN7kcxWanvtuaBCeMgGidrys', {action: 'submit'});

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, listId, token })
      });

      const data = await res.json();
      if (res.ok) {
        status.textContent = 'E-mail cadastrado com sucesso!';
        form.reset();
        showPopup('Sucesso!', 'Seu e-mail foi cadastrado com sucesso.');
      } else {
        const message = data.message || 'Erro ao cadastrar e-mail.';
        status.textContent = 'Erro: ' + message;
        showPopup('Erro!', message);
      }
    } catch (err) {
      console.error(err);
      status.textContent = 'Erro de conexão. Tente novamente.';
      showPopup('Erro!', 'Erro de conexão. Tente novamente.');
    }
  });
  return false;
}

function createStatusBelow(form) {
  const p = document.createElement('p');
  p.id = 'formStatus';
  p.className = 'status';
  p.setAttribute('role', 'status');
  form.parentNode.insertBefore(p, form.nextSibling);
  return p;
}

function showPopup(title, message) {
  const popupHtml = `
    <div class="popup" role="dialog" aria-modal="true" aria-labelledby="popup-title">
      <div class="popup-content">
        <h3 id="popup-title">${title}</h3>
        <p>${message}</p>
        <button class="btn btn--primary" onclick="closePopup()">Fechar</button>
      </div>
    </div>
  `;
  const popupDiv = document.createElement('div');
  popupDiv.innerHTML = popupHtml;
  document.body.appendChild(popupDiv.firstChild);
}

function closePopup() {
  const popup = document.querySelector('.popup');
  if (popup) {
    popup.remove();
  }
}

// Contact Form (unchanged from your original code)
async function sendMessage(e) {
  e.preventDefault();
  const form = e.target;
  const status = document.getElementById('formStatus');
  status.textContent = 'Enviando…';
  const data = Object.fromEntries(new FormData(form).entries());
  console.log(data); // Simula o envio do formulário de contato
  status.textContent = 'Mensagem enviada com sucesso! (Simulado)';
}

// Year in Footer
document.getElementById('year').textContent = new Date().getFullYear();
