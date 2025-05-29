const optButtons = document.querySelectorAll('#options li');

openOptions.addEventListener('pointerdown', toggleOptionsTab);
openVault.addEventListener('pointerdown', toggleVaultTab);

function toggleOptionsTab() {
  app.classList.toggle('optionsActive');
  vault.classList.toggle('optionsActive');
}

function toggleVaultTab() {
  app.classList.toggle('vaultActive');
  options.classList.toggle('vaultActive');
}

// like
document.querySelector('#vault').addEventListener('click', (event) => {
  if (event.target.tagName === 'LI') {
    event.target.classList.toggle('liked');
  }
});

// select length
optButtons.forEach(opt => {
  opt.addEventListener('click', (event) => {
    document.querySelector('#options .selected').classList.remove('selected');
    event.target.classList.add('selected');
    generateAndPaste();
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

function generateAndPaste() {
  field.remove();

  let newField = document.createElement('div');
  newField.id = 'field';
  newField.innerHTML = generateNaturalWord(parseFloat(document.querySelector('.selected').innerText));
  result.insertBefore(newField, openVault);

  addEvenToField();
}

// initial random name
generateAndPaste();

// field.addEventListener('click', () => {
//   let length = parseFloat(document.querySelector('.selected').innerText);
//   field.innerHTML = generateNaturalWord(length);
// });

////////////////////////////////////////////
////////   drag + local storage   //////////
////////////////////////////////////////////

// action icon animation
function favoriteOrTrashAnimation(xxx) {
  xxx.classList.remove('action');
  requestAnimationFrame(
    () => xxx.classList.add('action')
  );
}

let offsetX, offsetY;
let isDragging = false;
let isClosing = false;

function addEvenToField() {
  field.addEventListener('pointerdown', (e) => {
    isDragging = true;
    offsetX = e.clientX - field.offsetLeft;
    offsetY = e.clientY - field.offsetTop;
    field.classList.add('hold');
  });
  openOptions.addEventListener('pointerdown', (e) => {
    isClosing = true;
  });
  openVault.addEventListener('pointerdown', (e) => {
    isClosing = true;
  });
}

addEvenToField();

document.addEventListener('pointermove', (e) => {
  if (!isDragging) return;

  const x = e.clientX - offsetX;
  const y = e.clientY - offsetY;

  field.style.left = `${x}px`;
  field.style.top = `${y}px`;
});

document.addEventListener('pointerup', (e) => {
  isDragging = false;
  field.classList.remove('hold');

  let dropTarget = document.elementFromPoint(e.clientX, e.clientY);
  if (!isClosing && dropTarget && (dropTarget.id === 'trash' || dropTarget.closest('#trash'))) {
    favoriteOrTrashAnimation(trash);
    generateAndPaste();
  } else if (!isClosing && dropTarget && (dropTarget.id === 'favorite' || dropTarget.closest('#favorite'))) {
    favoriteOrTrashAnimation(favorite);
    document.querySelector('#vault ul').innerHTML += `
      <li>${field.innerText}</li>
    `;
    generateAndPaste();
  }

  // reset position:
  field.style.left = '';
  field.style.top = '';
  //reset closing flag
  isClosing = false;
});

// download database
// let words = downloadData();

// function downloadData() {
//   return JSON.parse(localStorage.getItem('items'));
// }

// function uploadData(data) {
//   localStorage.setItem('items', JSON.stringify(data));
// }

// function addWord() {
//   let newWord = {
//     liked: false,
//     text: `${randomText}`
//   }
//   words.unshift(newWord);

//   uploadData(words);
// }