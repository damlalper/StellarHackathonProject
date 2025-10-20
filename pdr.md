# 🧩 Ürün Tasarım Gereksinimleri (PDR) - Workshop Template

## 🎯 Temel Başlıklar

- **Proje Adı:** TicketChain – Web3 Etkinlik Biletleme  
- **Tür:** Blockchain tabanlı biletleme sistemi  
- **Platform:** Stellar Soroban  
- **Hedef:** Etkinlik biletlerini NFT olarak oluşturup, güvenli şekilde transfer edilebilen, karaborsa ve sahte bilet problemini çözen bir sistem geliştirmek.  

---

## 🎯 Proje Özeti

TicketChain, etkinlik biletlerinin Stellar ağında NFT olarak oluşturulmasını sağlayan bir Web3 tabanlı biletleme sistemidir.  
Her bilet blockchain üzerinde benzersiz bir kimliğe sahip olur, böylece karaborsa satışları, sahte bilet üretimi ve güvensiz ikinci el işlemler önlenir.  

Kullanıcılar bilet satın aldıklarında NFT cüzdanlarına tanımlanır, etkinliğe katıldıklarında da katılım rozetleri (POAP benzeri NFT’ler) alırlar.  

Proje, sade bir frontend arayüzü ve Stellar Soroban smart contract entegrasyonu ile testnet üzerinde çalışacak şekilde tasarlanmıştır.  

---

## 🚀 Kısaca Projenizi Anlatın

TicketChain, fiziksel veya dijital etkinliklerde biletleme sürecini güvenli, şeffaf ve takip edilebilir hale getiren bir Web3 çözümüdür.  
Her bilet bir NFT olarak oluşturulur ve biletin mülkiyeti, transfer geçmişi ve geçerliliği tamamen blockchain üzerinde doğrulanabilir.  

### Kullanıcılar:

- Etkinlik biletini dijital cüzdanlarıyla alabilir  
- Biletlerini güvenli şekilde ikinci el olarak satabilir  
- Katıldıkları etkinliklerden NFT rozetleri kazanarak profilinde bir katılım geçmişi oluşturabilir  

### Etkinlik Organizatörleri:

- Biletlerin izlenebilirliğini ve sınırlı arzını kontrol edebilir  
- Karaborsa satışlarını ve sahte bilet kopyalarını önleyebilir  

---

## 📋 Problem Tanımı

Mevcut biletleme sistemleri, özellikle popüler etkinliklerde ciddi karaborsa ve sahte bilet problemleriyle karşı karşıyadır.  
Biletlerin PDF veya QR kod olarak dağıtılması, bunların kopyalanmasına ve haksız kazanç elde edilmesine yol açar.  

Ayrıca ikinci el satışlar genellikle güvenli olmayan platformlar üzerinden yapıldığı için kullanıcılar dolandırıcılık riskiyle karşılaşır.  

TicketChain bu sorunları çözer:

- Her bilet bir NFT olarak Stellar ağında mint edilir  
- Transfer geçmişi blockchain üzerinde izlenebilir  
- Organizatör onayı olmadan transfer yapılamaz  
- Katılımcılara özel NFT rozetleri verilir  

Bu sayede biletlerin hem özgünlüğü hem de sahiplik durumu her zaman doğrulanabilir hale gelir.


---

## ✅ Yapılacaklar (Sadece Bunlar)

### Frontend Geliştirme

* Basic ve modern görünümlü bir frontend geliştireceğiz
* Karmaşık yapısı olmayacak


### Smart Contract Geliştirme

* Tek amaçlı, basit contract yazılacak
* Maksimum 3-4 fonksiyon içerecek
* Temel blockchain işlemleri (read/write)
* Minimal veri saklama
* Kolay test edilebilir fonksiyonlar

### Frontend Entegrasyonu

* Mevcut frontend'e müdahale edilmeyecek
* Sadece **JavaScript entegrasyon kodları** eklenecek
* Contract fonksiyonları frontend'e bağlanacak

### Wallet Bağlantısı

* **Freighter Wallet API** entegrasyonu
* Basit connect/disconnect işlemleri
* FreighterWalletDocs.md dosyasına bakarak bu dökümandaki bilgilerle ilerlemeni istiyorum 


---

## ❌ Yapılmayacaklar (Kesinlikle)

### Contract Tarafında

* ❌ Karmaşık iş mantığı
* ❌ Çoklu token yönetimi
* ❌ Gelişmiş access control
* ❌ Multi-signature işlemleri
* ❌ Complex state management
* ❌ Time-locked functions
* ❌ Fee calculation logic

### Frontend Tarafında

* ❌ Frontend tarafına karmaşık bir dosya yapısı yapılmayacak

---

## 🛠 Teknik Spesifikasyonlar

### Minimal Tech Stack

* **Frontend:** Next.js, Tailwind CSS, TypeScript
* **Contract:** Rust + Soroban SDK (basic)
* **Wallet:** Freighter API (sadece connect/sign)
* **Network:** Stellar Testnet

---

## 🧪 Test Senaryoları

* ✅ Contract deploy edilebiliyor mu?
* ✅ Wallet bağlantısı çalışıyor mu?
* ✅ Contract fonksiyonu çağrılabiliyor mu?
* ✅ Sonuç frontend'e dönüyor mu?
* ✅ Frontend düzgün çalışıyor mu?

---

## 📱 Copilot/Cursor'dan Vibe Coding sırasında uymasını istediğim ve check etmesi gereken adımlar

### Adım 2: Contract Yazımı 

* Basit contract template
* 3-4 fonksiyon maksimum
* Deploy et

### Adım 3: Entegrasyon

* Wallet connection
* Contract entegrasyonu
* Sonuç gösterme
---

## 🎯 Başarı Kriterleri

### Teknik Başarı

* ✅ Contract testnet'te çalışıyor
* ✅ Frontend contract entegrasyonu düzgün yapılmış
* ✅ Freighter wallet ile birlikte connect olabilme
* ✅ 3-4 fonksiyonlu basic çalışan bir contracta sahip olmak.

