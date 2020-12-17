import { Comment, NiconicomentPresenter } from './presenter';

chrome.browserAction.onClicked.addListener(() => {
    chrome.tabs.executeScript({ file: 'presenter.js' })
});