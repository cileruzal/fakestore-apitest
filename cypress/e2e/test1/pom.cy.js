import Login from '../../pages/Login.js';
import HomePage from '../../pages/HomePage.js';

describe('Page Object Pattern ile Login ve Logout Testleri', () => {

  // TEST №1
  it('tc01_senaryo1 - POP Sürümü', () => {
    Login.navigateUrl();
    Login.loginUser('user888@gmail.com', '1234567890');
    HomePage.openMenu();
    HomePage.logout();
    cy.url().should('include', '/account/login');
  });

  // TEST №2
  it('tc02_senaryo2 - POP Sürümü', () => {
    Login.navigateUrl();
    Login.loginUser('testowyqa@qa.team', 'QA!automation-1');
    HomePage.openMenu();
    HomePage.logout();
    cy.url().should('include', '/account/login');
  });

}); 