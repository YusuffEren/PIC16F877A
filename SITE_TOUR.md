# PIC16F877A Dijital Saat Simülasyonu — Adım Adım Site Turu

Bu rehber, siteye ilk kez giren bir ziyaretçinin gözünden projeyi adım adım anlatır. Tarayıcınızı açtığınızda karşınıza çıkan her bölüm, ekrandaki her renk, her animasyon ve her kod satırı burada açıklanmıştır.

---

## 1. Giriş (Hero) — Devrenin Boşluktan Doğuşu

Site adresine girdiğiniz anda karşınıza loş, koyu bir ekran çıkar. Arka planda hafifçe parlayan mavi-beyaz ışık halkaları vardır; bunlar donanım parçalarının üzerine düşecek ışık gibi düşünülebilir.

### 1.1 Başlık: "PIC16F877A Dijital Saat"
Sayfanın ortasında, büyük ve beyaz renkte bir başlık belirir. Ancak bu başlık aniden çıkmaz; harf harf ekrana yazılır. Sanki birisi klavyede tek tek tuşlara basıyormuş gibi, her karakter küçük bir zıplama ile yerine oturur. Bu, sitenin "montaj" temasının ilk ipucudur: her şey parça parça inşa edilecek.

### 1.2 Alt Başlık
Başlığın hemen altında daha sade bir yazı belirir:
> "Gerçek zamanlı saat sisteminin web tabanlı interaktif simülasyonu..."

Bu cümle, sitenin bir fiziksel projenin dijital kopyası olduğunu vurgular. Burası sadece bir sunum değil; gerçekten çalışan bir devrenin tarayıcı versiyonudur.

### 1.3 Montaj Alanı (Breadboard)
Başlıkların altında büyük bir breadboard (delikli plaka) görünür. Breadboard, elektronikçilerin devreleri kurduğu plastik bir zeminidir. Gri tonlarında, üzerinde küçük delikler ve kırmızı/mavi besleme hatları vardır. Animasyonun ilk adımı budur: breadboard boşluktan yukarı doğru belirir ve ekrana yerleşir.

### 1.4 Parçaların Yerleşimi
Breadboard boş kalmaz. Sırayla şu parçalar gelir:

- **PIC16F877A:** Soldan sağa doğru, hafifçe dönererek (8 derece) breadboard'un orta-üst kısmına oturur. Siyah bir çip, etrafında gümüş rengi 40 adet ayak (pin). Üzerinde "PIC16F877A" yazısı neon mavi renktedir. Bu, devrenin beynidir.
- **20 MHz Kristal:** Breadboard'un sağ-üst köşesine yakın bir yere düşer. Metalik bir silindir, altında "20.000 MHz" yazar. Yanında iki küçük sarı kondansatör (22pF) bulunur; bunlar kristalin stabilitesini sağlar.
- **LCD Ekran:** Breadboard'un orta-sol kısmından yukarı doğru büyüyerek belirir. Koyu bir çerçevesi ve içinde iki satırlık boş bir ekranı vardır. Henüz kapalı gibidir.
- **4 Adet Buton:** Breadboard'un alt kısmından sağa doğru sırayla kayarak gelirler. Her biri farklı renktedir:
  - **Yeşil (Saat Arttır)** — En solda.
  - **Kırmızı (Saat Azalt)** — Yeşilin sağında.
  - **Sarı (Dakika Arttır)** — Daha sağda.
  - **Mor (Dakika Azalt)** — En sağda.
  Her butonun üzerinde bir ok işareti (▲ veya ▼) ve altında beyaz bir etiket vardır.

### 1.5 Kablo Çizimleri (Wire Traces)
Montaj tamamlandıktan sonra, butonlardan PIC'e giden renkli kesikli çizgiler belirir. Her butonun kendi renginde bir çizgisi vardır. Bu çizgiler, fiziksel devredeki jumper kabloların sanal karşılığıdır. Ziyaretçiye "bu buton bu pine bağlı" mesajını görsel olarak verir.

### 1.6 LCD Açılışı (Boot Flicker)
Tüm parçalar yerleştikten sonra LCD ekranın içinde hafif bir mavi parıltı geçer. Sanki ekran ilk kez enerji alıyormuş gibi, içten dışa doğru bir ışık yayar ve söner. Ardından ekranın ilk satırında **"DIJITAL SAAT"** yazısı belirir. Bu, cihazın başarıyla başlatıldığını simgeler.

### 1.7 Alt Bilgi Çubuğu (Legend)
Montaj alanının hemen altında, her butonun rengiyle eşleşen küçük rozetler vardır:
- 🟢 Saat Arttır (RB0)
- 🔴 Saat Azalt (RB1)
- 🟡 Dakika Arttır (RB2)
- 🟣 Dakika Azalt (RB3)

"RB0", "RB1" gibi ifadeler, PIC mikrodenetleyicinin **PORTB** pinlerini gösterir. Bu, donanım ile yazılım arasındaki bağı ilk kez görselleştirir.

---

## 2. Sağ Üst Köşe — Dil Değiştirici

Sayfanın her yerinde, sağ üst köşede sabit duran yuvarlak bir buton vardır. Üzerinde küçük bir renkli nokta ve "TR → EN" (veya "EN → TR") yazar. Bu butona tıkladığınızda:
- URL `/tr` ise `/en`'ye geçer.
- URL `/en` ise `/tr`'ye geçer.
- Tüm başlıklar, açıklamalar, buton etiketleri ve kod yürüyüşü metinleri anında çevrilir.
- LCD üzerindeki "DIJITAL SAAT" yazısı da dile göre değişir.

Bu buton, projenin sadece teknik değil, aynı zamanda küresel erişilebilirlik hedefi taşıdığını gösterir.

---

## 3. İnteraktif Simülasyon Paneli

Sayfayı aşağı kaydırdığınızda, büyük bir cam kutu (glassmorphism panel) belirir. Kenarları hafifçe ışıldayan, içi bulanık (blur) bir zemin üzerine kuruludur. Bu panelin içinde devre "canlanır".

### 3.1 Durum Çubuğu (Status Bar)
Panelin en üstünde, küçük yuvarlak bir gösterge ve bir metin vardır:
- **Yeşil yanıp sönen nokta:** Saat döngüsü çalışıyor demektir. Yanıp sönme hızı, cihazın "yaşadığını" hissettirir.
- **Metin:** "Timer1 Aktif (50ms)" — Bu, PIC16F877A'nın gerçek zamanlayıcısının web tarayıcısındaki taklididir.
- **"Durdur" butonu:** Yeşil noktayı ve saat akışını durdurur. Metin kırmızuya döner: "Durduruldu". Tekrar basıldığında döngü kaldığı yerden devam eder.

### 3.2 LCD Ekran (Canlı)
Panelin ortasında, Hero bölümündeki LCD'nin daha büyük ve net bir versiyonu vardır. Şimdi gerçekten çalışıyor:
- **1. satır:** `DIJITAL SAAT` (veya İngilizce modunda `DIGITAL CLOCK`).
- **2. satır:** `00:00:00` formatında sürekli artan bir sayaç.
- Sayacın her saniyede bir değiştiğini görebilirsiniz. Rakamlar değişirken çok hafif bir büyüme/küçülme (scale) animasyonu yapar; bu, LCD'nin yenilendiğini görsel olarak hissettirir.
- LCD'nin etrafında neon mavi bir ışık vardır; karanlık odada bir saat ekranı gibi durur.

### 3.3 Butonlar (Etkileşimli)
LCD'nin altında, 4 adet buton yan yana dizilmiştir. Hero bölümündekilerle aynıdır, ancak şimdi gerçekten çalışırlar:

- **🟢 Saat Arttır (Hour+):** Tıkladığınızda LCD ekrandaki saat bir artar. Eğer saat 23 ise, bir sonraki tıklama 00 yapar (modüler aritmetik).
- **🔴 Saat Azalt (Hour−):** Saat bir azalır. 00 ise 23 olur.
- **🟡 Dakika Arttır (Minute+):** Dakika bir artar. 59 ise 00 olur ve saat bir artar.
- **🟣 Dakika Azalt (Minute−):** Dakika bir azalır. 00 ise 59 olur ve saat bir azalır.

**Butona bastığınızda şunları gözlemleyebilirsiniz:**
1. Buton fiziksel olarak içeri çöker (3D basma efekti).
2. Butonun içinden küçük, parlak bir sarı/amber nokta fırlar ve PIC yönüne doğru hareket eder. Bu, "elektrik sinyali PIC'e gidiyor" anlamındadır.
3. LCD ekran anında güncellenir.

**Debounce (Bas-çek) Davranışı:** Butona basılı tutsanız bile değer sadece **bir kez** değişir. Bunun nedeni, gerçek mikrodenetleyici kodunda kullanılan "yükselen kenar algılama" (rising-edge detection) mantığının burada da aktif olmasıdır. Mekanik butonların titreşimini simüle eden bu özellik, sitenin sadece görsel değil, işlevsel olarak da doğru olduğunu gösterir.

### 3.4 Bilgi Çipleri (Info Chips)
Panelin en altında, küçük yuvarlak rozetler vardır:
- **Kesme Sayacı: X/20** — Her 50ms'de bir artar; 20 olduğunda saniye bir artar. Gerçek zamanlı olarak görebilirsiniz.
- **_XTAL_FREQ: 20MHz** — Fiziksel devredeki kristal frekansı.
- **4-bit LCD Modu** — LCD'nin 8 pin yerine 4 pin (D4–D7) ile çalıştığını belirtir.
- **XC8 Compiler** — Kodun hangi derleyici ile derlendiğini gösterir.

---

## 4. Kod ve Donanım Yürüyüşü (Code Walkthrough)

Simülasyon panelini geçtikten sonra sayfanın en uzun ve en eğitici bölümü başlar. Ekran ikiye bölünmüştür:

- **Sol taraf (sticky):** Devrenin ilgili parçası sabit kalır.
- **Sağ taraf (scroll):** C kodunun ilgili bölümü aşağı kayar.

Sayfayı aşağı kaydırdıkça, kod blokları sırayla belirir ve sol taraftaki donanım parçası **parlamaya başlar**.

### 4.1 1. Bölüm: Konfigürasyon ve Pin Tanımları

**Sağ tarafta:**
C kodunun en üstündeki satırlar görünür:
```c
#pragma config FOSC = HS, WDTE = OFF, PWRTE = ON ...
#define RS RC0
#define EN RC2
```
Satırlar mor, pembe ve renkli olarak vurgulanmıştır. Kodun ne anlama geldiğini anlamak için okumaya gerek yoktur; hemen altında bir açıklama kartı belirir.

**Açıklama Kartı:**
> "Mikrodenetleyici çalışmaya başlamadan önce donanımın nasıl davranacağını belirten konfigürasyon bitleri ayarlanır..."

Kart, HS modunun ne olduğunu, watchdog timer'ın neden kapalı olduğunu, pin tanımlamalarının okunabilirliği nasıl artırdığını ve `TRISB`/`TRISD` kayıtlarının giriş/çıkış ayarlarını anlatır. 4 madde halinde özet bilgiler sunar.

**Sol tarafta:**
PIC16F877A çipi büyür, etrafında neon mavi bir hale (glow) belirir ve cyan renkli bir border halkası (ring) oluşur. Diğer donanım parçaları (kristal, LCD, butonlar) soluklaşır. Bu, "şu an bu kod bloğu PIC ile ilgili" mesajını verir.

### 4.2 2. Bölüm: LCD Hazırlık ve Komut Fonksiyonları

**Sağ tarafta:**
```c
void Lcd_Komut(unsigned char komut) { ... }
void Lcd_Hazirla() { ... }
```
LCD'nin nasıl başlatıldığını gösteren fonksiyonlar vardır. `0x28`, `0x0C`, `0x01` gibi hexadecimal komutlar vurgulanmıştır.

**Açıklama Kartı:**
> "LCD ekran 4-bit modda çalıştırılmıştır. Bu, 8 veri hattı yerine sadece D4–D7 pinleri kullanılarak PIC üzerinde pin tasarrufu sağlar..."

4-bit modun fiziksel avantajını, RS ve EN pinlerinin rollerini, her komut sonrası 2ms bekleme nedenini ve LCD'nin veriyi nasıl okuduğunu adım adım açıklar.

**Sol tarafta:**
LCD ekran parlamaya başlar. PIC soluklaşır. Kristal ve butonlar da geri planda kalır. LCD'nin etrafında aynı şekilde cyan border halkası belirir.

### 4.3 3. Bölüm: Timer1 Kesmesi (Interrupt)

**Sağ tarafta:**
```c
void __interrupt() kesme_servisi(void) {
    if (TMR1IF) {
        TMR1H = 0x86;
        TMR1L = 0x02;
        kesme_sayaci++;
        if (kesme_sayaci >= 20) { ... }
    }
}
```
Bu, projenin en teknik bölümüdür. Kesme servis rutini, sayaç artışı ve taşıma kontrolleri görülür.

**Açıklama Kartı:**
> "20 MHz kristal ile Timer1, bölücü (prescaler) 1:8 ayarında yaklaşık her 50 milisaniyede bir taşma (overflow) yapar..."

TMR1H ve TMR1L'nin neden bu değerleri aldığını, 20 sayacın 1 saniyeyi nasıl oluşturduğunu, kesme bayrağının (TMR1IF) neden temizlendiğini ve `GIE = 1` ile global kesmelerin nasıl açıldığını detaylandırır.

**Sol tarafta:**
Kristal osilatör parlamaya başlar. Çünkü bu bölüm, devrenin "kalbi" olan zamanlama kaynağını anlatır. Kristal ve yanındaki iki sarı kondansatör büyür, cyan glow alır.

### 4.4 4. Bölüm: Main Loop ve Buton Kontrolleri

**Sağ tarafta:**
```c
while(1) {
    if (B_SAAT_ARTIR == 1 && b1_eski == 0) { saat = (saat + 1) % 24; }
    b1_eski = B_SAAT_ARTIR;
    ...
}
```
Ana döngü ve buton kontrolleri görülür. Debounce mantığı burada somutlaşır.

**Açıklama Kartı:**
> "Mekanik butonlar basıldığında kısa süreli titreşimler (sönümlemeler) yapar. Bu titreşimler mikrodenetleyiciye çok sayıda 'basılıp bırakıldı' sinyali gönderebilir..."

Yükselen kenar algılamanın ne olduğunu, `b_eski` değişkenlerinin neden gerekli olduğunu, saat ve dakika sınır kontrollerinin nasıl yapıldığını ve modüler aritmetiğin (23→00, 59→00) nasıl işlediğini açıklar.

**Sol tarafta:**
4 adet buton parlamaya başlar. Hepsi aynı anda büyür, cyan glow ve border halkası alırlar. Bu, "kullanıcı etkileşimi zamanı" mesajını verir.

---

## 5. Footer (Kapanış)

Sayfanın en altına gelindiğinde, koyu bir zemin üzerine yerleştirilmiş bilgi alanı görülür:

- **"Proje Ekibi — Takım 5-56"** başlığı.
- 4 takım üyesinin adları; üzerine gelindiğinde renk değiştirir (hover efekti).
- Teknoloji rozetleri: XC8 Derleyici, MPLAB X IDE, Proteus Simülasyon, Next.js 16, Tailwind CSS, Zustand, GSAP, Framer Motion. Her rozet küçük, yuvarlak ve sade bir çerçeve içindedir.
- En altta: "Manisa Celal Bayar Üniversitesi — Elektrik Elektronik Mühendisliği & Bilgisayar Mühendisliği, Disiplinler Arası Proje — 2025-2026"

Bu bölüm, projenin akademik bir çalışma olduğunu ve takım çalışması ile tamamlandığını vurgular.

---

## 6. Genel Kullanıcı Deneyimi Öyküsü

Bir ziyaretçi siteye girdiğinde şu hikayeyi yaşar:

1. **Merak:** Karanlık ekranda parçalar beliriyor. "Ne kuruluyor?" sorusu oluşur.
2. **Tanışma:** Breadboard, PIC, LCD, butonlar... Her parça tanıdık ama dijital ortamda bir arada. Kabloların çizilmesi bağlantıları anlamlandırır.
3. **Etkileşim:** Butonlara basıldığında saat değişiyor. Bu bir resim değil, gerçekten çalışan bir şey.
4. **Öğrenme:** Aşağı kaydırıkça kodlar beliriyor. Her kod bloğunda "Bu ne işe yarıyor?" sorusunun cevabı hemen altında yazıyor.
5. **Senkronizasyon:** Sol taraftaki donanım parlıyor, sağ taraftaki kod vurgulanıyor. "Kod ile donanım arasındaki ilişki" görsel olarak somutlaşıyor.
6. **Sonuç:** Footer'da projenin arkasındaki isimleri görüyor. Teknik bir projenin, teknoloji ile estetiğin birleşimi olduğu hissediliyor.

---

*Bu rehber, siteyi hiç bilmeyen birinin adım adım anlamasını sağlamak için yazılmıştır. Her bölüm, ekrandaki görsel ve işlevsel unsurları detaylandırır.*
