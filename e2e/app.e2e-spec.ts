import { DosimaticPage } from './app.po';

describe('dosimatic App', () => {
  let page: DosimaticPage;

  beforeEach(() => {
    page = new DosimaticPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
