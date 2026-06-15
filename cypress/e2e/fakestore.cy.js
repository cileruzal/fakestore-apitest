describe('Fake Store API - Kurumsal E-Ticaret Otomasyon Test Süiti', () => {

    const getRandomString = () => Math.random().toString(36).substring(2, 10);
    const getRandomPrice = () => (Math.random() * (100 - 10) + 10).toFixed(2);
  
    it('1. GET - Tüm ürünleri getirmeli ve array döndüğünü doğrulamalı', () => {
      cy.request('GET', '/products').then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an('array');
        expect(response.body.length).to.be.greaterThan(0);
      });
    });
  
    it('2. GET - Dinamik query parametresi ile gelen ürün sayısını sınırlayabilmeli', () => {
      const randomLimit = Math.floor(Math.random() * 5) + 1; // 1 ile 5 arası rastgele limit
      
      cy.request({
        method: 'GET',
        url: '/products',
        qs: { limit: randomLimit } // ?limit=X dinamik parametresi (Ödev Kriteri)
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an('array');
        expect(response.body.length).to.eq(randomLimit);
      });
    });
  
    // 3. GET İsteği - Response Body (E-Ticaret Şeması) Detaylı Doğrulaması
    it('3. GET - Tek bir ürünün e-ticaret veri şemasını ve tiplerini doğrulamalı', () => {
      cy.request('GET', '/products/1').then((response) => {
        expect(response.status).to.eq(200);
        
        // Kurumsal Şema ve Veri Formatı Kontrolleri (Ödev Kriteri)
        expect(response.body).to.have.all.keys('id', 'title', 'price', 'description', 'category', 'image', 'rating');
        expect(response.body.id).to.be.a('number').and.to.eq(1);
        expect(response.body.title).to.be.a('string');
        expect(response.body.rating).to.be.an('object').and.have.all.keys('rate', 'count');
      });
    });
  
    // 4. GET İsteği - Özel Başlık (Custom Header) Gönderme ve Doğrulama
    it('4. GET - Custom User-Agent göndermeli ve yanıt header tipini kontrol etmeli', () => {
      cy.request({
        method: 'GET',
        url: '/products/categories',
        headers: {
          'User-Agent': 'Cypress-Enterprise-QA-Agent', // Ödev Kriteri
          'Accept-Language': 'en-US',
          'X-Platform': 'Web-Automation-Framework' // Özel kurumsal başlık
        }
      }).then((response) => {
        expect(response.status).to.eq(200);
        // Yanıt başlığı kontrolü
        expect(response.headers).to.have.property('content-type');
        expect(response.headers['content-type']).to.include('application/json');
      });
    });
  
    // 5. GET İsteği - Yanıt Süresi (API Performans Testi)
    it('5. GET - API performansını ölçmeli (Yanıt süresi 600ms altında olmalı)', () => {
      cy.request('GET', '/products').then((response) => {
        // Ödev Kriteri: Yanıt sürelerini değerlendirme (Performans analizi)
        expect(response.duration).to.be.lessThan(600); 
      });
    });
  
// 6. POST İsteği - Dinamik E-Ticaret Verisi ile Yeni Ürün Ekleme
it('6. POST - Rastgele e-ticaret verileriyle sisteme yeni ürün eklemeli', () => {
    const randomProductTitle = `Kurumsal_Ürün_${getRandomString()}`;

    cy.request({
      method: 'POST',
      url: '/products',
      body: {
        title: randomProductTitle,
        price: 45.99, // Hata riskini sıfırlamak için float veri tipinde sabitledik
        description: 'Otomasyon frameworkü tarafından dinamik olarak eklenen ürün açıklaması.',
        image: 'https://i.pravatar.cc',
        category: 'electronics'
      }
    }).then((response) => {
      // Fake Store API başarılı eklemeye 200 veya 201 döner
      expect(response.status).to.be.oneOf([200, 201]); 
      expect(response.body.title).to.eq(randomProductTitle);
      expect(response.body).to.have.property('id'); // Dinamik oluşan ID kontrolü
    });
  });
  
    // 7. PUT İsteği - Ürün Bilgilerini Tamamen Güncelleme
    it('7. PUT - Mevcut bir ürünün tüm bilgilerini baştan aşağı güncellemeli', () => {
      const updatedProduct = {
        title: 'Güncellenmiş Kurumsal Telefon',
        price: 999.99,
        description: 'PUT isteği ile tüm gövde yenilendi.',
        image: 'https://i.pravatar.cc',
        category: 'electronics'
      };
  
      cy.request('PUT', '/products/7', updatedProduct).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.title).to.eq(updatedProduct.title);
        expect(response.body.price).to.eq(updatedProduct.price);
      });
    });
  
    // 8. PATCH İsteği - Fiyat Alanını Kısmi Güncelleme
    it('8. PATCH - Ürünün sadece fiyat alanını kısmi olarak güncellemeli', () => {
      const newPrice = parseFloat(getRandomPrice());
  
      cy.request({
        method: 'PATCH',
        url: '/products/7',
        body: {
          price: newPrice
        }
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.price).to.eq(newPrice);
      });
    });
  
    // 9. DELETE İsteği - Ürün Silme Operasyonu
    it('9. DELETE - Belirtilen e-ticaret ürününü sistemden silmeli', () => {
      cy.request('DELETE', '/products/6').then((response) => {
        expect(response.status).to.eq(200);
      });
    });
  
    // 10. Negatif Test - Olmayan Ürün ID Sorgusu (Hata Yakalama)
    it('10. GET (Negatif Test) - Olmayan bir ürün sorgulandığında boş body veya hata dönmeli', () => {
      cy.request({
        method: 'GET',
        url: '/products/99999',
        failOnStatusCode: false // Testin çökmesini engeller
      }).then((response) => {
        // Fake Store API yapısı gereği olmayan kayıtlarda 200/404 durumuna göre body boş döner
        expect(response.status).to.be.oneOf([200, 404]);
        if (response.status === 200) {
          expect(response.body).to.be.empty; 
        }
      });
    });
  });