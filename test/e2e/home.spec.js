describe('HomeController', () => {

  beforeEach(() => {
    browser.get('http://localhost:3000/');
  });

  it('should have "United States National Parks" title', () => {
    expect(browser.getTitle()).toEqual('United States National Parks');
  });

  it('should have 29 states in state filter dropdown', () => {
    expect(element.all(by.repeater('state in states')).count()).toEqual(29);
  });

  it('should initially have 6 options in sort dropdown', () => {
    expect(element.all(by.repeater('sort in sorts')).count()).toEqual(6);
  });

  it('should have 59 parks listed', () => {
    expect(element.all(by.repeater('park in parks')).count()).toEqual(59);
  });

  it('should have 10 parks listed with search term "mountains"', () => {
    element(by.model('searchText')).sendKeys('mountains');

    expect(element.all(by.repeater('park in parks')).count()).toEqual(10);
  });

  it('should have 11 parks listed with state filter option "AK - Alaska"', () => {
    element(by.id('stateMenu')).click();
    element.all(by.repeater('state in states')).get(1).click();

    expect(element.all(by.repeater('park in parks')).count()).toEqual(8);
  });

  it('should list "Zion National Park" as first park after reverse alphabetical sort', () => {
    element(by.id('sortMenu')).click();
    element.all(by.repeater('sort in sorts')).get(1).click();

    element.all(by.repeater('park in parks'))
    .then((parks) => {
      const parkName = parks[0].element(by.binding('park.fullName'));
      expect(parkName.getText()).toEqual('Zion National Park');
    });
  });

  it('should list "Yosemite National Park" as first park after reverse alphabetical sort with state filter option "CA - California"', () => {
    element(by.model('searchText')).sendKeys('valley');

    element(by.id('stateMenu')).click();
    element.all(by.repeater('state in states')).get(4).click();

    element(by.id('sortMenu')).click();
    element.all(by.repeater('sort in sorts')).get(1).click();

    element.all(by.repeater('park in parks'))
    .then((parks) => {
      const parkName = parks[0].element(by.binding('park.fullName'));
      expect(parkName.getText()).toEqual('Yosemite National Park');
    });
  });

});
