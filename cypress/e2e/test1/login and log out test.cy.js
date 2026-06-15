describe('login ve logout olmayı test ediyoruz', function() {

   it('tc01_senaryo1', () => {
     
     cy.visit('https://www.edu.goit.global/account/login')
     cy.get('#user_email').type('user888@gmail.com')
     cy.get('#user_password').type('1234567890')
     cy.get('.eckniwg2').click()
     cy.get('#open-navigation-menu-mobile').click()
     cy.get(':nth-child(13) > .next-1f1d9nl').click()
     cy.url().should('include', 'https://www.edu.goit.global/homepage')
  
    })


   it('tc02_senaryo2', () => {
    cy.visit('https://www.edu.goit.global/account/login')
    cy.get('#user_email').type('testowyqa@qa.team')
    cy.get('#user_password').type('QA!automation-1')
    cy.get('#open-navigation-menu-mobile').click()
    cy.get(':nth-child(13) > .next-1f1d9nl').click()
    cy.url().should('include', 'https://www.edu.goit.global/homepage')

   })

 })


