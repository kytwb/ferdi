import { desktopCapturer } from 'electron';

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
  transition: background-color .15s, box-shadow .15s;
}
.desktop-capturer-selection__btn:hover,
.desktop-capturer-selection__btn:focus {
  background: rgba(98,100,167,.8);
}
.desktop-capturer-selection__thumbnail {
  width: 100%;
  height: 81px;
  object-fit: cover;
}
.desktop-capturer-selection__name {
  margin: 6px 0 6px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
`;

// Patch getDisplayMedia for screen sharing
window.navigator.mediaDevices.getDisplayMedia = () => new Promise(async (resolve, reject) => {
  try {
    const sources = await desktopCapturer.getSources({ types: ['screen', 'window'] });

    const selectionElem = document.createElement('div');
    selectionElem.classList = 'desktop-capturer-selection';
    selectionElem.innerHTML = `
        <div class="desktop-capturer-selection__scroller">
          <ul class="desktop-capturer-selection__list">
            ${sources.map(({
    id, name, thumbnail,
  }) => `
              <li class="desktop-capturer-selection__item">
                <button class="desktop-capturer-selection__btn" data-id="${id}" title="${name}">
                  <img class="desktop-capturer-selection__thumbnail" src="${thumbnail.toDataURL()}" />
                  <span class="desktop-capturer-selection__name">${name}</span>
                </button>
              </li>
            `).join('')}
          </ul>
        </div>
      `;
    document.body.appendChild(selectionElem);

    document.querySelectorAll('.desktop-capturer-selection__btn')
      .forEach((button) => {
        button.addEventListener('click', async () => {
          try {
            const id = button.getAttribute('data-id');
            const mediaSource = sources.find(source => source.id === id);
            if (!mediaSource) {
              throw new Error(`Source with id ${id} does not exist`);
            }

            const stream = await window.navigator.mediaDevices.getUserMedia({
              audio: false,
              video: {
                mandatory: {
                  chromeMediaSource: 'desktop',
                  chromeMediaSourceId: mediaSource.id,
                },
              },
            });
            resolve(stream);

            selectionElem.remove();
          } catch (err) {
            reject(err);
          }
        });
      });
  } catch (err) {
    reject(err);
  }
});
