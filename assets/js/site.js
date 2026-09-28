(() => {
  'use strict';
  const data = JSON.parse(document.getElementById('bnak-data').textContent);
  const dialog = document.getElementById('bnak-dialog');
  const menu = document.getElementById('mobile-menu');
  const menuButton = document.querySelector('[data-testid="button-menu-toggle"]');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let opener, step = 1, selected = null, fields = {}, donation = 'KES 500';

  document.querySelectorAll('header nav a').forEach(link => {
    link.classList.remove('text-[#d72f2a]');
    if (new URL(link.href).pathname === location.pathname) {
      link.setAttribute('aria-current', 'page');
      link.classList.add('text-[#d72f2a]');
    }
  });
  menuButton.addEventListener('click', () => {
    menu.hidden = !menu.hidden;
    menuButton.setAttribute('aria-expanded', String(!menu.hidden));
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !menu.hidden) {
      menu.hidden = true;
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.focus();
    }
  });

  function remember() {
    dialog.querySelectorAll('[name]').forEach(input => { fields[input.name] = input.value; });
  }
  function ready() {
    if (step === 3) return Boolean(selected);
    return [...dialog.querySelectorAll('input, select')].every(input =>
      (!input.required || input.value.trim()) && input.checkValidity());
  }
  function updateReady() {
    const next = dialog.querySelector('[data-next], [data-testid="button-stk-push"]');
    if (next) next.disabled = !ready();
  }
  function showStep() {
    dialog.innerHTML = document.getElementById(`membership-step-${step}`).innerHTML;
    dialog.querySelectorAll('[name]').forEach(input => { input.value = fields[input.name] || ''; });
    dialog.querySelectorAll('[data-testid^="button-package-"]').forEach(button => {
      const key = button.dataset.testid.replace('button-package-', '');
      button.setAttribute('aria-pressed', String(selected?.key === key));
      button.classList.toggle('ring-2', selected?.key === key);
      button.classList.toggle('ring-[#d72f2a]', selected?.key === key);
    });
    if (step === 4 && selected) {
      dialog.querySelector('[data-package-title]').textContent = selected.title;
      dialog.querySelector('[data-package-audience]').textContent = selected.audience;
      const price = dialog.querySelector('[data-package-price]');
      price.firstChild.textContent = selected.price;
      dialog.querySelector('[name="paymentPhone"]').value = fields.paymentPhone || fields.phone || '';
    }
    updateReady();
    dialog.scrollTop = 0;
    const heading = dialog.querySelector('h3') || dialog.querySelector('h2');
    heading.tabIndex = -1;
    heading.focus();
  }
  function open(kind, trigger) {
    opener = trigger;
    menu.hidden = true;
    menuButton.setAttribute('aria-expanded', 'false');
    dialog.dataset.kind = kind;
    step = 1; selected = null; fields = {}; donation = 'KES 500';
    if (kind === 'membership') showStep();
    else {
      dialog.innerHTML = document.getElementById('donate-template').innerHTML;
      const form = dialog.querySelector('form');
      const other = document.createElement('label');
      other.className = 'block text-sm font-bold';
      other.hidden = true;
      other.textContent = 'Amount in KES';
      const input = document.createElement('input');
      input.type = 'number'; input.min = '1'; input.step = '1'; input.name = 'customAmount';
      input.className = 'mt-2 w-full rounded-xl border border-[#dcd4c2] bg-[#fff9ed] px-4 py-3';
      other.append(input);
      form.insertBefore(other, form.querySelector('[type="submit"]'));
    }
    dialog.showModal();
    document.body.style.overflow = 'hidden';
  }
  dialog.addEventListener('close', () => {
    document.body.style.overflow = '';
    fields = {}; selected = null;
    dialog.innerHTML = '';
    opener?.focus();
  });
  dialog.addEventListener('click', event => {
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener('input', () => {
    if (dialog.dataset.kind === 'membership') { remember(); updateReady(); }
  });
  dialog.addEventListener('change', updateReady);

  function showUnavailable(kind) {
    const container = dialog.querySelector('.relative');
    container.innerHTML = `<div class="rounded-2xl border border-[#7abf61] bg-[#fff1c7] p-6" role="status" tabindex="-1"><h2 id="modal-title" class="display-face text-3xl font-semibold">${kind === 'donate' ? 'Donation payments are not connected yet' : 'STK Push setup needed'}</h2><p class="mt-4 text-sm leading-relaxed">No payment has been requested or collected, and your details have not been submitted. Contact BNak to ${kind === 'donate' ? 'arrange your support' : 'complete your membership'}.</p><a href="mailto:hello@bnak.co.ke" class="mt-5 inline-block font-bold underline">hello@bnak.co.ke</a><div class="mt-6 flex gap-3"><button type="button" data-restart class="rounded-full bg-[#276ba4] px-5 py-3 text-sm font-bold text-[#f5f0e5]">Start again</button><button type="button" data-close class="rounded-full border border-[#276ba4] px-5 py-3 text-sm font-bold">Close</button></div></div>`;
    container.querySelector('[role="status"]').focus();
  }
  dialog.addEventListener('submit', event => {
    event.preventDefault();
    if (event.target.reportValidity()) showUnavailable('donate');
  });
  document.addEventListener('click', event => {
    const button = event.target.closest('button, [data-modal]');
    if (!button) return;
    if (button.dataset.modal) return open(button.dataset.modal, button);
    if (!dialog.contains(button)) return;
    const id = button.dataset.testid || '';
    if (id === 'button-modal-close' || button.hasAttribute('data-close')) return dialog.close();
    if (button.hasAttribute('data-restart')) {
      const kind = dialog.dataset.kind;
      dialog.close();
      return open(kind, opener);
    }
    if (button.hasAttribute('data-next') && ready()) {
      remember(); step++; return showStep();
    }
    if (button.hasAttribute('data-back') || button.textContent.trim() === 'Back') {
      remember(); step = Math.max(1, step - 1); return showStep();
    }
    if (id.startsWith('button-package-')) {
      selected = data.packages.find(item => item.key === id.replace('button-package-', ''));
      dialog.querySelectorAll('[data-testid^="button-package-"]').forEach(item => {
        const active = item === button;
        item.setAttribute('aria-pressed', String(active));
        item.classList.toggle('ring-2', active);
        item.classList.toggle('ring-[#d72f2a]', active);
      });
      return updateReady();
    }
    if (id === 'button-stk-push' && ready()) return showUnavailable('membership');
    if (dialog.dataset.kind === 'donate' && ['KES 500', 'KES 1,000', 'Other'].includes(button.textContent.trim())) {
      donation = button.textContent.trim();
      button.parentElement.querySelectorAll('button').forEach(item => {
        const active = item === button;
        item.setAttribute('aria-pressed', String(active));
        item.classList.toggle('bg-[#ffe2cf]', active);
        item.classList.toggle('border-[#d72f2a]', active);
      });
      const input = dialog.querySelector('[name="customAmount"]');
      input.parentElement.hidden = donation !== 'Other';
      input.required = donation === 'Other';
      dialog.querySelector('[type="submit"]').textContent = donation === 'Other' ? 'Continue with your amount' : `Continue with ${donation}`;
    }
  });

  const landing = document.getElementById('landing');
  if (landing) {
    const images = [...landing.querySelectorAll('img.absolute')];
    const frame = images[0].parentElement;
    const caption = frame.querySelector('.absolute.inset-x-6');
    const category = frame.querySelector('.absolute.left-5');
    let index = 0, paused = reducedMotion;
    function showSlide(next) {
      index = (next + data.slides.length) % data.slides.length;
      images.forEach((img, i) => {
        img.classList.toggle('opacity-100', i === index);
        img.classList.toggle('opacity-0', i !== index);
        img.setAttribute('aria-hidden', String(i !== index));
      });
      const slide = data.slides[index];
      category.lastChild.textContent = slide.label;
      caption.querySelector('p').textContent = `“${slide.quote}”`;
      caption.querySelector('p.font-bold').textContent = slide.name;
      caption.querySelector('p.text-sm').textContent = slide.place;
      caption.querySelector('.mono-face').textContent = `${String(index + 1).padStart(2, '0')} / 10`;
    }
    const previous = document.querySelector('[data-testid="button-slide-previous"]');
    const next = document.querySelector('[data-testid="button-slide-next"]');
    previous.addEventListener('click', () => showSlide(index - 1));
    next.addEventListener('click', () => showSlide(index + 1));
    const pause = document.createElement('button');
    pause.type = 'button'; pause.className = 'rounded-full bg-[#f5f0e5] px-3 text-xs font-bold shadow-lg';
    const label = () => { pause.textContent = paused ? 'Play' : 'Pause'; pause.setAttribute('aria-label', paused ? 'Play slideshow' : 'Pause slideshow'); };
    label(); pause.addEventListener('click', () => { paused = !paused; label(); });
    next.parentElement.prepend(pause);
    showSlide(0);
    setInterval(() => { if (!paused && !document.hidden && !dialog.open && !frame.parentElement.matches(':hover, :focus-within')) showSlide(index + 1); }, 5400);
  }
})();
