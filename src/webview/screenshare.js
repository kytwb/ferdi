import { desktopCapturer } from 'electron';

const CANCEL_ID = 'desktop-capturer-selection__cancel';

export async function getDisplayMediaSelector() {
  const sources = await desktopCapturer.getSources({ types: ['screen', 'window'] });
  return `<div class="desktop-capturer-selection__scroller">
  <ul class="desktop-capturer-selection__list">
    ${sources.map(({ id, name, thumbnail }) => `
      <li class="desktop-capturer-selection__item">
        <button class="desktop-capturer-selection__btn" data-id="${id}" title="${name}">
          <img class="desktop-capturer-selection__thumbnail" src="${thumbnail.toDataURL()}" />
          <span class="desktop-capturer-selection__name">${name}</span>
        </button>
      </li>
    `).join('')}
    <li class="desktop-capturer-selection__item">
      <button class="desktop-capturer-selection__btn" data-id="${CANCEL_ID}" title="Cancel">
        <span class="desktop-capturer-selection__name desktop-capturer-selection__name--cancel">Cancel</span>
      </button>
    </li>
  </ul>
</div>`;
}

export const screenShareCss = `
.desktop-capturer-selection {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: rgba(30,30,30,.75);
  color: #fff;
  z-index: 10000000;
  display: flex;
  align-items: center;
  justify-content: center;
}
.desktop-capturer-selection__scroller {
  width: 100%;
  max-height: 100vh;
  overflow-y: auto;
}
.desktop-capturer-selection__list {
  max-width: calc(100% - 100px);
  margin: 50px;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  list-style: none;
  overflow: hidden;
  justify-content: center;
}
.desktop-capturer-selection__item {
  display: flex;
  margin: 4px;
}
.desktop-capturer-selection__btn {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  width: 145px;
  margin: 0;
  border: 0;
  border-radius: 3px;
  padding: 4px;
  background: #252626;
  text-align: left;
  transition: background-color .15s, box-shadow .15s, color .15s;
  color: #dedede;
}
.desktop-capturer-selection__btn:hover,
.desktop-capturer-selection__btn:focus {
  background: rgba(98,100,167,.8);
  box-shadow: 0 0 4px rgba(0,0,0,0.45), 0 0 2px rgba(0,0,0,0.25);
  color: #fff;
}
.desktop-capturer-selection__thumbnail {
  width: 100%;
  height: 81px;
  object-fit: cover;
}
.desktop-capturer-selection__name {
  margin: 6px 0;
  white-space: nowrap;
  text-overflow: ellipsis;
  text-align: center;
  overflow: hidden;
}
.desktop-capturer-selection__name--cancel {
  margin: auto 0;
}
`;

export const screenShareJs = `
window.navigator.mediaDevices.getDisplayMedia = () => new Promise(async (resolve, reject) => {
  try {
    const selectionElem = document.createElement('div');
    selectionElem.classList = ['desktop-capturer-selection'];
    selectionElem.innerHTML = await window.ferdi.getDisplayMediaSelector();
    document.body.appendChild(selectionElem);

    document
      .querySelectorAll('.desktop-capturer-selection__btn')
      .forEach((button) => {
        button.addEventListener('click', async () => {
          try {
            const id = button.getAttribute('data-id');
            if (id === '${CANCEL_ID}') {
              reject(new Error('Cancelled by user'));
            } else {
              const stream = await window.navigator.mediaDevices.getUserMedia({
                audio: false,
                video: {
                  mandatory: {
                    chromeMediaSource: 'desktop',
                    chromeMediaSourceId: id,
                  },
                },
              });
              resolve(stream);
            }
          } catch (err) {
            reject(err);
          } finally {
            selectionElem.remove();
          }
        });
      });
  } catch (err) {
    reject(err);
  }
});
`;
