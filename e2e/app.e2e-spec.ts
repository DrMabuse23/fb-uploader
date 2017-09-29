import { FbUploaderPage } from './app.po';

describe('fb-uploader App', () => {
  let page: FbUploaderPage;

  beforeEach(() => {
    page = new FbUploaderPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
