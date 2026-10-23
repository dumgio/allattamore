/* Aggiunte per la versione statica del sito.
   Senza WordPress i moduli non possono inviare dati: aprono il programma di posta
   con il messaggio già compilato, indirizzato all'associazione. */
(function () {
	var EMAIL = 'allattamore@gmail.com';

	function apriEmail(oggetto, righe) {
		window.location.href = 'mailto:' + EMAIL +
			'?subject=' + encodeURIComponent(oggetto) +
			'&body=' + encodeURIComponent(righe.join('\n'));
	}

	function etichetta(campo) {
		return campo.getAttribute('data-original_title') || campo.getAttribute('placeholder') || campo.name;
	}

	// Modulo "Richiedi informazioni" (Divi): blocca l'invio al server e apre l'email
	document.addEventListener('submit', function (e) {
		var form = e.target.closest('.et_pb_contact_form');
		if (!form) return;
		e.preventDefault();
		e.stopImmediatePropagation();
		var righe = [], mancante = false;
		form.querySelectorAll('input[type=text], input[type=email], textarea').forEach(function (c) {
			if (c.getAttribute('data-required_mark') === 'required' && !c.value.trim()) mancante = true;
			if (c.value.trim()) righe.push(etichetta(c) + ': ' + c.value.trim());
		});
		var consenso = form.querySelector('input[type=checkbox]');
		if (consenso && !consenso.checked) {
			alert('Per inviare il messaggio occorre accettare il trattamento dei dati personali.');
			return;
		}
		if (mancante) {
			alert('Compila tutti i campi obbligatori.');
			return;
		}
		apriEmail('Richiesta informazioni dal sito', righe);
	}, true);

	// Iscrizione alla newsletter
	document.addEventListener('click', function (e) {
		var bottone = e.target.closest('.et_pb_newsletter_button');
		if (!bottone) return;
		e.preventDefault();
		e.stopImmediatePropagation();
		var box = bottone.closest('.et_pb_newsletter');
		var nome = box.querySelector('input[name=et_pb_signup_firstname]');
		var email = box.querySelector('input[name=et_pb_signup_email]');
		if (!email || !email.value.trim()) {
			alert('Inserisci il tuo indirizzo email.');
			return;
		}
		apriEmail('Iscrizione alla newsletter', [
			'Vorrei iscrivermi alla newsletter di AllattAmore.',
			'Nome: ' + (nome ? nome.value.trim() : ''),
			'Email: ' + email.value.trim()
		]);
	}, true);

	// Galleria: foto ingrandita con frecce avanti/indietro
	var box = document.querySelector('.am-lightbox');
	if (!box) return;
	var foto = Array.prototype.slice.call(document.querySelectorAll('.am-foto'));
	var img = box.querySelector('img');
	var attuale = 0;
	function mostra(i) {
		attuale = (i + foto.length) % foto.length;
		img.src = foto[attuale].href;
		box.hidden = false;
	}
	foto.forEach(function (a, i) {
		a.addEventListener('click', function (e) { e.preventDefault(); mostra(i); });
	});
	box.querySelector('.am-chiudi').onclick = function () { box.hidden = true; };
	box.querySelector('.am-prec').onclick = function () { mostra(attuale - 1); };
	box.querySelector('.am-succ').onclick = function () { mostra(attuale + 1); };
	box.addEventListener('click', function (e) { if (e.target === box) box.hidden = true; });
	document.addEventListener('keydown', function (e) {
		if (box.hidden) return;
		if (e.key === 'Escape') box.hidden = true;
		if (e.key === 'ArrowLeft') mostra(attuale - 1);
		if (e.key === 'ArrowRight') mostra(attuale + 1);
	});
})();
