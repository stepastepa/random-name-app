function toggleHiddenPanel(triggerIcon, panelsToMove, panelsToHide, xLength, isDrag, isClick, xHidden, toRightOrLeft, timing) {
  const isRight = toRightOrLeft === 'right';
  const direction = isRight ? 1 : -1;
  let startX = 0;
  let currentX = 0;
  let isOpen = false;
  let dragging = false;
  let isMoved = false;
  let isNotClick = false;
  let translateX = [];

  ////////////////////////////////////////
  //////////   clicking logic   //////////
  ////////////////////////////////////////

  const showPanel = () => {
    panelsToMove.forEach(el => {
      el.style.transition = `all ${timing}ms ease`;
      el.classList.add('active');
      triggerIcon.style.transition = `all ${timing}ms ease`;
      triggerIcon.classList.add('active');
      if (el.classList.contains('content')) {
        el.style.transform = `translateX(${direction * xHidden}vw)`;
      } else {
        el.style.transform = `translateX(0)`;
      }
    });
    panelsToHide.forEach(el => {
      el.style.zIndex = -99;
    });
    isOpen = true;
  };

  const hidePanel = () => {
    panelsToMove.forEach(el => {
      el.style.transition = `all ${timing}ms ease`;
      el.classList.remove('active');
      triggerIcon.style.transition = `all ${timing}ms ease`;
      triggerIcon.classList.remove('active');
      if (el.classList.contains('content')) {
        el.style.transform = 'translateX(0)';
      } else {
        el.style.transform = `translateX(${direction * (-1) * 100}%)`;
      }
    });
    panelsToHide.forEach(el => {
      setTimeout(() => {
        el.style.zIndex = 0;
      }, timing); // ожидаем 0.3сек, чтоб анимация завершилась
    });
    isOpen = false;
  };

  if (isClick) {
    triggerIcon.addEventListener('mouseup', () => {
      console.log('isNotClick final --------before---------- ' + isNotClick);
      if (isNotClick) return;
      console.log('isNotClick final --------after---------- ' + isNotClick);
      isOpen ? hidePanel() : showPanel();
      console.log('end clicking');
      isNotClick = false;
    });
  }

  ////////////////////////////////////////
  //////////   dragging logic   //////////
  ////////////////////////////////////////

  function getTranslateX(el) {
    console.log(el);
    const transform = getComputedStyle(el).getPropertyValue('transform');
    let transX = 0;
    if (transform !== 'none') {
      const matrix = transform.match(/matrix.*\((.+)\)/)[1].split(', ');
      transX = parseFloat(matrix[4]);
    }
    console.log('x - ' + transX);
    return transX;
  }

  if (isDrag) {
    // mouse
    triggerIcon.addEventListener('mousedown', (e) => {
      dragging = true;
      startX = e.clientX;
      console.log('startX - ' + startX);
      panelsToMove.forEach(el => el.style.transition = 'none');

      translateX = []; // reset (на всякий случай)
      panelsToMove.forEach(el => {
        translateX.push(getTranslateX(el));
      });
      // console.log('translateX - ' + translateX);
    });
    // finger 🖐🖐🖐🖐🖐
    triggerIcon.addEventListener('touchstart', (e) => {
      dragging = true;
      startX = e.touches[0].clientX;
      panelsToMove.forEach(el => el.style.transition = 'none');
      translateX = []; // reset (на всякий случай)
      panelsToMove.forEach(el => {
        translateX.push(getTranslateX(el));
      });
    });

    // mouse
    document.addEventListener('mousemove', (e) => {
      if (!dragging) return;
      isMoved = true;
      isNotClick = true;
      console.log('isNotClick - ' + isNotClick);
      console.log('start dragging');

      currentX = e.clientX;
      let delta = currentX - startX;
      console.log('delta - ' + delta);

      ////////// is wrong direction? //////////
      /*
      if (isOpen) {
        if (direction === 1) {
          if (delta > 0) { delta = 0; }
        } else {
          if (delta < 0) { delta = 0; }
        }
      } else if (!isOpen) {
        if (direction === 1) {
          if (delta < 0) { delta = 0; }
        } else {
          if (delta > 0) { delta = 0; }
        }
      }
      */
      const isWrongDirection =
        (direction === 1 && ((isOpen && delta > 0) || (!isOpen && delta < 0))) ||
        (direction !== 1 && ((isOpen && delta < 0) || (!isOpen && delta > 0)));

      if (isWrongDirection) {
        delta = 0;
      }
      /////////////////////////////////////////

      panelsToMove.forEach((el, index) => {
        if (el.classList.contains('content')) {
          el.style.transform = `translateX(${delta + translateX[index]}px)`;
        } else {
          el.style.transform = `translateX(${delta + translateX[index]}px)`;
        }
      });
    });
    // finger 🖐🖐🖐🖐🖐
    document.addEventListener('touchmove', (e) => {
      if (!dragging) return;
      isMoved = true;
      isNotClick = true;

      currentX = e.touches[0].clientX;
      let delta = currentX - startX;

      ////////// is wrong direction? //////////
      const isWrongDirection =
        (direction === 1 && ((isOpen && delta > 0) || (!isOpen && delta < 0))) ||
        (direction !== 1 && ((isOpen && delta < 0) || (!isOpen && delta > 0)));

      if (isWrongDirection) {
        delta = 0;
      }
      /////////////////////////////////////////

      panelsToMove.forEach((el, index) => {
        if (el.classList.contains('content')) {
          el.style.transform = `translateX(${delta + translateX[index]}px)`;
        } else {
          el.style.transform = `translateX(${delta + translateX[index]}px)`;
        }
      });
    });

    // mouse
    document.addEventListener('mouseup', () => {
      dragging = false;
      console.log('end dragging');
      console.log('isOpen - ' + isOpen);
      if (!isMoved) return;

      let finalDelta = currentX - startX;
      ////////// is wrong direction? //////////
      const isWrongDirection =
        (direction === 1 && ((isOpen && finalDelta > 0) || (!isOpen && finalDelta < 0))) ||
        (direction !== 1 && ((isOpen && finalDelta < 0) || (!isOpen && finalDelta > 0)));

      if (isWrongDirection) {
        finalDelta = 0;
      } else {
        finalDelta = Math.abs(finalDelta);
      }
      /////////////////////////////////////////

      console.log('finalDelta - ' + finalDelta);
      if (!isOpen) {
        if (finalDelta > xLength) {
          showPanel();
          console.log('showing');
          isNotClick = false;
        } else {
          hidePanel();
          console.log('hiding');
          isNotClick = false;
        }
      } else if (isOpen) {
        if (finalDelta > xLength) {
          hidePanel();
          console.log('hiding');
          isNotClick = false;
        } else {
          showPanel();
          console.log('showing');
          isNotClick = false;
        }
      }
      isMoved = false;
    });
    // finger 🖐🖐🖐🖐🖐
    document.addEventListener('touchend', () => {
      dragging = false;
      if (!isMoved) return;

      let finalDelta = currentX - startX;
      ////////// is wrong direction? //////////
      const isWrongDirection =
        (direction === 1 && ((isOpen && finalDelta > 0) || (!isOpen && finalDelta < 0))) ||
        (direction !== 1 && ((isOpen && finalDelta < 0) || (!isOpen && finalDelta > 0)));

      if (isWrongDirection) {
        finalDelta = 0;
      } else {
        finalDelta = Math.abs(finalDelta);
      }
      /////////////////////////////////////////

      if (!isOpen) {
        if (finalDelta > xLength) {
          showPanel();
          isNotClick = false;
        } else {
          hidePanel();
          isNotClick = false;
        }
      } else if (isOpen) {
        if (finalDelta > xLength) {
          hidePanel();
          isNotClick = false;
        } else {
          showPanel();
          isNotClick = false;
        }
      }
      isMoved = false;
    });
  }
}

////////////////////////////////////////
export { toggleHiddenPanel };
////////////////////////////////////////

/*
toggleHiddenPanel(
  openOptions,         // triggerIcon
  [app],               // panelsToMove
  [vault],             // panelsToHide
  100,                 // xLength (trigger after ...px drag)
  true,                // isDrag
  true,                // isClick
  80,                  // xHidden (what is moved away in ...vw(%))
  'right',             // toRightOrLeft
  300                  // timing
);

toggleHiddenPanel(
  openVault,           // triggerIcon
  [app],               // panelsToMove
  [options],           // panelsToHide
  100,                 // xLength (trigger after ...px drag)
  true,                // isDrag
  true,                // isClick
  80,                  // xHidden (what is moved away in ...vw(%))
  'left',              // toRightOrLeft
  300                  // timing
);
*/