import { toggleHiddenPanel } from '/random-name-app/sliding-panels.js';

const optButtons = document.querySelectorAll('#options li');

let isDeleting = false;

///////////////////////////////////////////////
////////   showing and hiding panels   ////////
///////////////////////////////////////////////

toggleHiddenPanel(
  openOptions,         // triggerIcon
  [app, vault],        // panelsToMove <-> .onscreen(80vw-0) vs (0-100%)
  [],                  // panelsToHide (add z-index: -99)
  20,                  // xLength (trigger after ...% drag)
  true,                // isDrag
  true,                // isClick
  80,                  // xHidden (what is moved away in ...vw)
  'right',             // toRightOrLeft
  300                  // timing
);

toggleHiddenPanel(
  openVault,           // triggerIcon
  [app, options],      // panelsToMove <-> .onscreen(80vw-0) vs (0-100%)
  [],                  // panelsToHide (add z-index: -99)
  20,                  // xLength (trigger after ...% drag)
  true,                // isDrag
  true,                // isClick
  80,                  // xHidden (what is moved away in ...vw)
  'left',              // toRightOrLeft
  300                  // timing
);

// like
document.querySelector('#vault').addEventListener('click', (event) => {
  // console.log('is deleting: ' + isDeleting);
  if (event.target.tagName === 'LI' && !isDeleting) {
    // console.log('click');
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
  const vowels = 'aeiouy';
  const consonants = 'bcdfghjklmnpqrstvwxz';

  const frequentPairs = ['th', 'qu', 'st', 'ou', 'ch', 'sh', 'ph', 'tr', 'br', 'cl'];
  const frequentSyllables = ['tra', 'ble', 'quo', 'ver', 'str', 'pre', 'com', 'gen', 'lex', 'mor'];

  const prefixes = ['un', 're', 'ex', 'pre', 'sub', 'trans', 'im', 'de', 'in'];
  const suffixes = ['ion', 'ity', 'ous', 'al', 'ing', 'or', 'ist', 'ed', 'es'];


  //// грубая проверка на читаемость ////

  const forbiddenClusters = [
    // Повторы согласных
    'bbb', 'ccc', 'ddd', 'fff', 'ggg', 'hhh', 'jjj', 'kkk', 'lll', 'mmm', 'nnn', 'ppp', 'qqq', 'rrr', 'sss', 'ttt', 'vvv', 'www', 'xxx', 'yyy', 'zzz',

    // Повторы гласных или сложные повторения
    'aaee', 'eeaa', 'iiuu', 'uuoo', 'ouuo', 'yiyi', 'iyiy', 'uaie', 'iei', 'ayei', 'eeie',

    // Подряд 3+ согласных
    'ttr', 'clf', 'cch', 'ggj', 'xkj', 'bvt', 'znk', 'dkg', 'mgj', 'ptk', 'zkq', 'clx', 'clz', 'xqx', 'xzk', 'qtr', 'qkr',

    // Невозможные/редкие начальные кластеры
    'xq', 'zx', 'qz', 'qv', 'qj', 'qb', 'qd', 'qg', 'qx', 'qk', 'qf',

    // Сомнительные сочетания
    'ayi', 'uyu', 'yiy', 'iyi', 'yiy', 'iei', 'uyy', 'iyy', 'iyy', 'yuy', 'yeu', 'iyu',

    // Сложные зеркальные сочетания
    'xvx', 'bzb', 'pdp', 'kqk', 'xyx', 'zyz', 'tkt', 'gzg', 'djd',

    // Редкие и неестественные согласные кластеры
    'bcf', 'gdt', 'plg', 'xbt', 'rdk', 'zpk', 'nzc', 'ptg', 'qcp', 'vbx', 'nkq', 'ckz', 'czq', 'jzr', 'lzq', 'zdv',

    // Странные окончания
    'qz', 'xz', 'zzq', 'xqz', 'vgz', 'zzv', 'xxk', 'kkz', 'zkk', 'cck',

    // Длинные неестественные группы
    'mnmn', 'bcbc', 'bdbd', 'kdkd', 'zgzg', 'mzgm', 'xmxm', 'rqrq', 'xqxq', 'kzkz',

    // Примеры повторяющихся редких букв
    'qq', 'jj', 'yy', 'zz', 'xx', 'vv', 'kk', 'gg', 'ww',

    // Нереальные группы гласных
    'aeou', 'uoai', 'aeiy', 'yyoo', 'eaei', 'ouaa', 'ieou', 'yaou'
  ];

  // function isPronounceable(word) {
  //   return !forbiddenClusters.some(cluster => word.includes(cluster));
  // }

  function isPronounceable(word) {
    for (const cluster of forbiddenClusters) {
      if (word.includes(cluster)) return false;
    }
    // запрет 4+ согласных подряд
    if (/[bcdfghjklmnpqrstvwxz]{4,}/.test(word)) return false;

    return true;
  }
  
  //// мягкая проверка на читаемость ////

  function isPhoneticallyPlausible(word) {
    const vowelSet = new Set(['a', 'e', 'i', 'o', 'u', 'y']);
    const onsetClusters = ['bl', 'br', 'cl', 'cr', 'dr', 'fl', 'fr', 'gl', 'gr', 'pl', 'pr', 'sl', 'sm', 'sn', 'sp', 'st', 'str', 'sw', 'tr'];
    const codaClusters = ['nd', 'nt', 'st', 'ld', 'rd', 'lk', 'mp', 'ng', 'sk', 'pt', 'ct'];

    const lower = word.toLowerCase();

    // 1. Проверка начального кластера
    for (let i = 3; i > 0; i--) {
      const start = lower.slice(0, i);
      if (onsetClusters.includes(start)) break;
      if (i === 1 && !vowelSet.has(start)) return false;
    }

    // 2. Проверка конечного кластера
    for (let i = 3; i > 0; i--) {
      const end = lower.slice(-i);
      if (codaClusters.includes(end)) break;
      if (i === 1 && !vowelSet.has(end)) return false;
    }

    // 3. Проверка чрезмерных подряд согласных (например, больше 3 подряд)
    let maxConsonants = 0;
    let current = 0;
    for (const ch of lower) {
      if (!vowelSet.has(ch)) {
        current++;
        if (current > maxConsonants) maxConsonants = current;
      } else {
        current = 0;
      }
    }
    if (maxConsonants > 3) return false;

    // 4. Проверка невозможных сочетаний
    const impossible = ['qx', 'xq', 'jj', 'yy', 'zzq', 'ttr', 'cck', 'ggt', 'ptk', 'mnmn'];
    for (const pattern of impossible) {
      if (lower.includes(pattern)) return false;
    }

    return true;
  }

  ////////////////

  function generateOnce() {
    let word = '';
    let remaining = length;

    if (Math.random() < 0.5 && remaining > 6) {
      const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
      word += prefix;
      remaining -= prefix.length;
    }

    while (remaining > 3) {
      let chunk = '';
      const position = word.length === 0 ? 'start' : (remaining <= 4 ? 'end' : 'middle');

      const choice = Math.random();
      if (choice < 0.2) {
        chunk = frequentPairs[Math.floor(Math.random() * frequentPairs.length)];
      } else if (choice < 0.5) {
        chunk = frequentSyllables[Math.floor(Math.random() * frequentSyllables.length)];
      } else {
        const c = consonants[Math.floor(Math.random() * consonants.length)];
        let vPool = vowels;
        if (position === 'start') {
          vPool = 'aeiou';
        }
        const v = vPool[Math.floor(Math.random() * vPool.length)];
        chunk = c + v;
      }

      if (chunk.length > remaining) break;
      word += chunk;
      remaining -= chunk.length;
    }

    if (remaining > 2 && Math.random() < 0.5) {
      const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
      if (suffix.length <= remaining) {
        word += suffix;
        remaining -= suffix.length;
      }
    }

    while (remaining > 0) {
      const pool = consonants + (word.length === 0 ? 'aeiou' : vowels);
      word += pool[Math.floor(Math.random() * pool.length)];
      remaining--;
    }

    return word;
  }

  // Перегенерация, если слово не проходит проверку
  for (let attempt = 0; attempt < 100; attempt++) {
    const candidate = generateOnce();
    // двойная проверка
    if (isPronounceable(candidate)) {
      return candidate;
    }
    if (isPhoneticallyPlausible(candidate)) {
      return candidate;
    }
  }

  // Если за 10 попыток не удалось — возвращаем последнее
  return generateOnce();
}

// for (let i = 0; i < 10; i++) {
//   const len = Math.floor(Math.random() * 6) + 5;
//   console.log(generateNaturalWord(len));
// }

//
/////
//////////

function generateAndPaste() {
  field.remove();

  let newField = document.createElement('div');
  newField.id = 'field';
  newField.classList.add('draggable'); // 🔥 иначе игнорирует preventDefault
  newField.innerHTML = generateNaturalWord(parseFloat(document.querySelector('.selected').innerText));
  result.insertBefore(newField, openVault);

  addEventsToField();
}

// initial random name
generateAndPaste();

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

function addEventsToField() {
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

addEventsToField();

document.addEventListener('pointermove', (e) => {
  if (!isDragging) return;
  e.preventDefault(); // 🔥 блокируем прокрутку страницы

  const x = e.clientX - offsetX;
  const y = e.clientY - offsetY;

  field.style.left = `${x}px`;
  field.style.top = `${y}px`;
}, { passive: false }); // 👈 обязательно, чтобы preventDefault работал

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
      <li class='draggable'>${field.innerText}</li>
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

// 🔴🔴🔴 заменить на универсальную функцию 🔴🔴🔴
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
      e.preventDefault(); // 🔥 блокируем горизонтальную прокрутку
    }, { passive: false }); // 👈 обязательно, чтобы preventDefault работал
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