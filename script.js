const optButtons = document.querySelectorAll('#options li');

let isDeleting = false;

function draggingToToggle(trigger, item, leftOrRight, xTrigger, classTooltip, classTransformEnd, isDelete) {
  let startX = 0;
  let currentX = 0;
  let translateX = 0;

  let isDragging = false;
  let isOpen = false;

  const startDrag = (xxx) => {
    startX = xxx;
    isDragging = true;
    item.style.transition = 'none';

    function getTranslateX() {
      const transform = getComputedStyle(item).getPropertyValue('transform');
      let translateX = 0;
      if (transform !== 'none') {
        const matrix = transform.match(/matrix.*\((.+)\)/)[1].split(', ');
        translateX = parseFloat(matrix[4]);
      }
      return translateX;
    }

    if(isOpen) {
      translateX = getTranslateX();
    }
    console.log(startX);
  };

  const moveDrag = (xxx) => {
    if (!isDragging) return;

    currentX = xxx - startX + translateX;
    console.log(currentX);

    if (
      (currentX < 0 && leftOrRight === 'left') ||
      (currentX > 0 && leftOrRight === 'right') ||

      (isOpen && currentX > 0 && leftOrRight === 'left') ||
      (isOpen && currentX < 0 && leftOrRight === 'right')
      ) {
      item.style.transform = `translateX(${currentX}px)`;
    }
    if (currentX < xTrigger && classTooltip) {
      item.classList.add(classTooltip);
      isDeleting = true;
    } else if (classTooltip){
      item.classList.remove(classTooltip);
    }
  };

  const endDrag = () => {
    if (!isDragging) return;
    isDragging = false;
    isOpen = true;
    if ((currentX < (xTrigger + translateX) && leftOrRight === 'left') || (currentX > (xTrigger + translateX) && leftOrRight === 'right')) {
      console.log('opened!');
      item.style.transition = 'transform 0.2s ease-out';
      item.classList.add(classTransformEnd);
      item.style.transform = '';
      if(isDelete === 'delete') {
        setTimeout(() => item.remove(), 200);
      }
    } else {
      item.style.transition = 'transform 0.2s ease-out';
      item.classList.remove(classTransformEnd);
      item.style.transform = '';
    }
  };

  trigger.addEventListener('mousedown', e => startDrag(e.clientX));
  document.addEventListener('mousemove', e => moveDrag(e.clientX));
  document.addEventListener('mouseup', endDrag);

  trigger.addEventListener('touchstart', e => startDrag(e.touches[0].clientX));
  trigger.addEventListener('touchmove', e => {
    moveDrag(e.touches[0].clientX);
    e.preventDefault(); // блокирует горизонтальную прокрутку
  }, { passive: false });
  trigger.addEventListener('touchend', endDrag);
}

draggingToToggle(openOptions, app, 'right', 100, 'noToolTip', 'optionsActive', 'noDelete');
draggingToToggle(openOptions, vault, 'right', 100, 'noToolTip', 'optionsActive', 'noDelete');
draggingToToggle(openVault, app, 'left', -100, 'noToolTip', 'vaultActive', 'noDelete');
draggingToToggle(openVault, options, 'left', -100, 'noToolTip', 'vaultActive', 'noDelete');

// like
document.querySelector('#vault').addEventListener('click', (event) => {
  if (event.target.tagName === 'LI' && !isDeleting) {
    event.target.classList.toggle('liked');
  }
  isDeleting = false;
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

/////////////////////////////////////////////////
////////   dragging and regenerating   //////////
/////////////////////////////////////////////////

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

    // add to vault and set item
    document.querySelector('#vault ul').innerHTML += `
      <li>${field.innerText}</li>
    `;
    setVaultItems();

    generateAndPaste();
  }

  // reset position:
  field.style.left = '';
  field.style.top = '';
  //reset closing flag
  isClosing = false;
});

////////////////////////////////////////////////
////////   removing from vault list   //////////
////////////////////////////////////////////////

function setVaultItems() {
  const items = document.querySelectorAll('#vault li');

  items.forEach(item => {
    let startX = 0;
    let currentX = 0;
    let isDragging = false;

    const startDrag = (xxx) => {
      startX = xxx;
      isDragging = true;
      item.style.transition = 'none';
    };

    const moveDrag = (xxx) => {
      if (!isDragging) return;
      currentX = xxx - startX;
      if (currentX < 0) {
        item.style.transform = `translateX(${currentX}px)`;
      }
      if (currentX < -50) {
        item.classList.add('deleting');
        isDeleting = true;
      } else {
        item.classList.remove('deleting');
      }
    };

    const endDrag = () => {
      if (!isDragging) return;
      isDragging = false;
      if (currentX < -50) {
        item.style.transition = 'transform 0.2s ease-out';
        item.style.transform = 'translateX(-150%)';
        setTimeout(() => item.remove(), 200);
      } else {
        item.style.transition = 'transform 0.2s ease';
        item.style.transform = 'translateX(0)';
      }
    };

    item.addEventListener('mousedown', e => startDrag(e.clientX));
    document.addEventListener('mousemove', e => moveDrag(e.clientX));
    document.addEventListener('mouseup', endDrag);

    item.addEventListener('touchstart', e => startDrag(e.touches[0].clientX));
    item.addEventListener('touchmove', e => {
      moveDrag(e.touches[0].clientX);
      e.preventDefault(); // блокирует горизонтальную прокрутку
    }, { passive: false });
    item.addEventListener('touchend', endDrag);
  });
}

////////////////////////////////////
////////   localStorage   //////////
////////////////////////////////////

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