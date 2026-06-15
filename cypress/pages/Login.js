export class login {

    navigateUrl(){
        cy.visit('https://www.edu.goit.global/account/login');
    }

    getUserEmailInput() {
        return cy.get('#user_email');
      }

    getUserPasswordInput() {
        return cy.get('#user_password');
      }

      getLoginButton() {
        return cy.get('.eckniwg2');
      }

}
