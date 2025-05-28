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

/////////////////////////////////////////
////////   random generation   //////////
/////////////////////////////////////////

function generateNaturalWord(length) {
  const vowels = 'aeiou';
  const consonants = 'bcdfghjklmnpqrstvwxyz';

  let word = '';
  let useVowel = Math.random() < 0.5;

  let sameTypeStreak = 1; // Сколько подряд идёт гласных или согласных
  const maxStreak = 3; // Максимум подряд (aa / qqq)

  for (let i = 0; i < length; i++) {
    const letterSet = useVowel ? vowels : consonants;
    const randomIndex = Math.floor(Math.random() * letterSet.length);
    word += letterSet[randomIndex];

    // Решаем, менять ли тип (гласные / согласные)
    if (sameTypeStreak >= maxStreak || Math.random() < 0.5) {
      useVowel = !useVowel;
      sameTypeStreak = 1;
    } else {
      sameTypeStreak++;
    }
  }

  return word;
}

field.addEventListener('click', () => {
  let length = parseFloat(document.querySelector('.selected').innerText);
  // console.log(length);
  field.innerHTML = generateNaturalWord(length);
});