const optButtons = document.querySelectorAll('#options li');

openOptions.addEventListener('click', toggleOptionsTab);
openVault.addEventListener('click', toggleVaultTab);

function toggleOptionsTab() {
  app.classList.toggle('optionsActive');
  vault.classList.toggle('optionsActive');
}

function toggleVaultTab() {
  app.classList.toggle('vaultActive');
  options.classList.toggle('vaultActive');
}

document.querySelector('#vault').addEventListener('click', (event) => {
  if (event.target.tagName === 'LI') {
    event.target.classList.toggle('liked');
  }
});

optButtons.forEach(opt => {
  opt.addEventListener('click', (event) => {
    document.querySelector('#options .selected').classList.remove('selected');
    event.target.classList.add('selected');
  });
});