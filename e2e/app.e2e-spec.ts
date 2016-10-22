import { AngularRxjsLifegamePage } from './app.po';

describe('angular-rxjs-lifegame App', function() {
  let page: AngularRxjsLifegamePage;

  beforeEach(() => {
    page = new AngularRxjsLifegamePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
