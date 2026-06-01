# PIC16F877A Dijital Saat Web Simülasyonu — Proje Dokümantasyonu

## 1. Projenin Amacı ve Kapsamı

Bu web sitesi, fiziksel olarak geliştirilmiş "Mikrodenetleyici ile Gerçek Zamanlı Saat Sistemi" projesinin web tarayıcısı üzerinde çalışan interaktif bir simülasyonudur.

Temel amaç, **PIC16F877A mikrodenetleyicisi** ile yazılmış gömülü sistem C kodunun ve donanım mimarisinin web ortamında birebir deneyimlenmesini sağlamaktır. Site, statik bir tanıtım sayfasından ziyade, elektronik bileşenlerin sanal olarak çalıştığı, kod ve donanım ilişkisini görselleştiren eğitici bir portfolyo aracıdır.

---

## 2. Kullanılan Teknolojiler

| Teknoloji | Amaç |
|-----------|------|
| **Next.js 16 (App Router)** | Bileşen tabanlı yapı, sunucu tarafı işleme, dosya sistemine dayalı yönlendirme |
| **React 19** | UI bileşenleri, durum yönetimi ve etkileşimli simülasyon mantığı |
| **TypeScript** | Tip güvenliği ve IDE desteği ile hata önleme |
| **Tailwind CSS** | Modüler, hızlı ve duyarlı (responsive) tasarım |
| **Zustand** | C kodundaki değişkenlerin (`saat`, `dak`, `sn`, `kesme_sayaci`) global ve performanslı yönetimi |
| **GSAP (ScrollTrigger)** | Sayfa kaydırma ile tetiklenen karmaşık zaman çizelgeleri (timeline) ve donanım parlatma animasyonları |
| **Framer Motion** | Buton bas-çek (debounce) efektleri, LCD panel veri geçişleri ve mikro etkileşimler |
| **SVG** | Donanım bileşenlerinin (Breadboard, PIC, LCD, Buton) DOM üzerinde manipüle edilebilir çizimleri |
| **next-intl** | Türkçe ve İngilizce çoklu dil desteği |

---

## 3. Klasör Yapısı ve Mimari Kararları

```
src/
  app/
    [locale]/              → Çoklu dil desteği için yerel ayar bazlı layout ve sayfalar
    globals.css            → Tema değişkenleri, özel animasyonlar ve scrollbar stilleri
    layout.tsx             → Kök HTML yapısı
    page.tsx               → / adresini /tr'ye yönlendirir
  components/
    hardware/              → SVG tabanlı donanım bileşenleri
      Breadboard.tsx
      Crystal.tsx          → 20MHz kristal + 22pF kondansatörler
      HwButton.tsx         → 4 farklı renkte, ▲/▼ ikonlu butonlar
      LcdDisplay.tsx       → 16x2 karakter ekran, neon mavi arka ışık
      Pic16f877a.tsx       → 40-pin DIP paket, pin etiketleriyle
    sections/
      Hero.tsx             → Montaj animasyonu, kablo çizimleri, buton çağrıları
      CircuitSimulation.tsx → Canlı saat, Timer1 taklidi, başlat/durdur kontrolü
      CodeReview.tsx       → İki kolonlu kod inceleme, ScrollTrigger senkronizasyonu
      Footer.tsx           → Takım bilgileri, kullanılan teknolojiler
    ui/
      CodeBlock.tsx        → Satır numaralı, highlight'lı ve syntax renkli kod gösterimi
      ExplanationCard.tsx  → Her kod bloğu altında detaylı açıklama kartları
      LanguageSwitcher.tsx → TR↔EN dil değiştirici buton (sağ üst köşe)
      Section.tsx          → Yeniden kullanılabilir bölüm wrapper'ı
  data/
    projectCode.ts         → Orijinal C kodunun tam metni (main.c)
  hooks/
    useInterruptTimer.ts   → 50ms aralıklarla `tick()` çağıran custom hook
  store/
    useClockStore.ts       → Zustand store: saat, dakika, saniye, kesme_sayaci, buton debounce
  animations/
    gsapAnimations.ts      → Montaj timeline'ı ve ScrollTrigger senkronizasyonu
    motionVariants.ts      → Framer Motion tekrar kullanılabilir varyantları
  i18n/
    request.ts             → next-intl mesaj yükleme konfigürasyonu
    routing.ts             → [tr, en] locale tanımlamaları
  middleware.ts            → next-intl çoklu dil yönlendirmesi
```

---

## 4. Zustand Durum Yönetimi (State Mantığı)

### 4.1 Değişkenler

| Değişken | Tip | Aralık | Açıklama |
|----------|-----|--------|----------|
| `saat` | `number` | 0–23 | Saat değeri |
| `dakika` | `number` | 0–59 | Dakika değeri |
| `saniye` | `number` | 0–59 | Saniye değeri |
| `kesme_sayaci` | `number` | 0–19 | C'deki Timer1 kesme sayacının eşdeğeri |
| `isRunning` | `boolean` | — | Saat döngüsünün çalışma durumu |
| `b1_eski` … `b4_eski` | `number` | 0/1 | Her butonun bir önceki durumu (debounce için) |

### 4.2 Aksiyonlar

- **`tick()`**: JavaScript `setInterval` ile **50ms** aralıklarla çalışır. `kesme_sayaci` her çağrıda artırılır; **20. çağrıda (20 × 50ms = 1000ms)** saniye artırılır. Dakika ve saat taşıma kontrolleri C kodundaki gibi yapılır.
- **`incrementHour()` / `decrementHour()` / `incrementMinute()` / `decrementMinute()`**: Butonlardan gelen sinyalleri işler, sınır kontrollerini (0–23, 0–59) ve **debounce** mantığını (`b_eski` karşılaştırması) uygular.

---

## 5. Donanım SVG Bileşenleri

Her donanım parçası, orijinal fiziksel projedeki özelliklerine sadık kalınarak SVG formatında çizilmiştir:

### 5.1 Breadboard (Delikli Plaka)
- Merkezi yarık (groove), kırmızı (+) ve mavi (−) besleme hatları.
- Düzenli delik deseni (pattern), sütun numaraları.
- Gölge efekti ile 3D hissi.

### 5.2 PIC16F877A
- **40-pin DIP paket** görünümü: Siyah gövde, gümüş ayaklar, notch işareti.
- Her pinin numarası ve önemli pinlerin (MCLR, VDD, VSS, OSC1/2, RD4–RD7, RB0–RB3) isimleri SVG üzerinde yer alır.

### 5.3 LCD Ekran (16×2)
- **Neon mavi arka ışık** (glow filtresi ile).
- 16×2 karakter ızgarası.
- 1. satır: `DIJITAL SAAT` başlığı.
- 2. satır: `00:00:00` formatında gerçek zamanlı sayaç.
- Pin isimleri alt kenarda: VSS, VDD, VO, RS, RW, EN, D4–D7.

### 5.4 Kristal Osilatör (20MHz)
- Metal kaplı kristal gövdesi.
- **2 adet 22pF kondansatör** ile toprak bağlantısı.
- OSC1 ve OSC2 pin bağlantıları.

### 5.5 Butonlar (4 adet)
- **Renk kodları ile ayrım:**
  - 🟢 **Saat+** (Yeşil) — RB0
  - 🔴 **Saat−** (Kırmızı) — RB1
  - 🟡 **Dakika+** (Sarı) — RB2
  - 🟣 **Dakika−** (Mor) — RB3
- Her butonun üzerinde **▲** (arttır) veya **▼** (azalt) ikonu bulunur.
- **3D silindirik kapak** görünümü, pin ayakları ve basıldığında zıplama (spring) animasyonu.
- **Elektrik sinyal parçacığı (spark):** Butona basıldığında amber renkli bir nokta butondan PIC'e doğru hareket ederek sinyal iletimini simüle eder.

---

## 6. Animasyon ve Etkileşim Kurgusu

### 6.1 Açılış (Hero) Animasyonu — GSAP Timeline

Sayfa yüklendiğinde aşağıdaki sırayla çalışır:

1. **Breadboard** ekrana merkezlenir (yukarıdan düşerek).
2. **PIC16F877A** soldan elastik yaylanma (`elastic.out`) ile oturur.
3. **Kristal osilatör** yukarıdan zıplayarak (`bounce.out`) yerine oturur.
4. **LCD ekran** alttan büyüyerek (`back.out`) yerleşir.
5. **Kablolar** (wire traces) belirir; kesikli renkli çizgiler butonları PIC'e bağlar.
6. **Butonlar** sırayla sağdan gelir (`stagger`), yerlerine oturur.
7. Başlık **karakter karakter ekrana yazılır** (typing efekti).
8. Alt başlık belirir.
9. LCD **açılış parlaması (boot flicker)** — ekran kısa süreli parlama efektiyle açılır.

### 6.2 Devre Şeması Etkileşimi — Framer Motion

- Butona basıldığında **3D basma efekti** (`scale: 0.93`) ve **elektrik sinyali** (spark) çalışır.
- Butonlardan PIC'e giden kablo çizimleri sabit olarak görünür; sayfa montajı tamamlandıktan sonra yavaşça belirirler.

### 6.3 Kod İnceleme Alanı — GSAP ScrollTrigger

Sayfa aşağı kaydırıldıkça:

- **Sol sütun (sticky hardware panel):** Devrenin ilgili kısmı **büyür, cyan glow efekti alır ve etrafında border halkası belirir**; diğer parçalar soluklaşır.
- **Sağ sütun (kod):** C kodu blokları sırayla görünür. Her blok altında **ExplanationCard** ile detaylı açıklamalar yer alır.
- Senkronizasyon:
  - `Konfigürasyon` → **PIC** parlar.
  - `LCD Fonksiyonları` → **LCD** parlar.
  - `Timer1 Kesmesi` → **Kristal** parlar.
  - `Buton Kontrolleri` → **Butonlar** parlar.

---

## 7. Çoklu Dil Desteği (i18n)

Site **Türkçe** ve **İngilizce** olarak kullanılabilir.

- **next-intl** kütüphanesi ile `messages/tr.json` ve `messages/en.json` dosyalarından çeviriler yüklenir.
- URL yapısı: `/tr` (Türkçe), `/en` (English).
- Kök adres (`/`) otomatik olarak `/tr`'ye yönlendirir.
- Sağ üst köşede **sabit dil değiştirici buton** bulunur; mevcut dil yeşil (TR) veya mavi (EN) nokta ile gösterilir.
- Çevrilen içerikler: başlıklar, açıklamalar, buton etiketleri, kod yürüyüşü açıklamaları, footer bilgileri.

---

## 8. Gerçek Zamanlı Saat Mantığı (Timer1 Taklidi)

PIC16F877A'ın C kodunda Timer1 kesmesi yaklaşık **50ms** periyotla çalışır ve **20 kesme = 1 saniye** eder. Web simülasyonu bu mantığı birebir taklit eder:

- `useInterruptTimer.ts` hook'u `setInterval(..., 50)` ile her 50ms'de `tick()` çağırır.
- `tick()` her çağrıda `kesme_sayaci`'yı artırır.
- `kesme_sayaci >= 20` olduğunda saniye artırılır; dakika ve saat taşıma kontrolleri uygulanır.
- **Başlat/Durdur** butonu ile döngü duraklatılabilir veya yeniden başlatılabilir.
- Ekranda anlık **Kesme Sayacı: X/20** bilgisi görünür.

---

## 9. Debounce (Bas-Çek) Simülasyonu

Mekanik butonlar basıldığında titreşim (bounce) yapar. Bu istenmeyen tekrarları önlemek için C kodunda "yükselen kenar algılama" kullanılır:

```c
if (B_SAAT_ARTIR == 1 && b1_eski == 0) { saat = (saat + 1) % 24; }
b1_eski = B_SAAT_ARTIR;
```

Web simülasyonu bu mantığı `useClockStore` içindeki `b1_eski`…`b4_eski` değişkenleriyle birebir korur. Butona her basışta yalnızca **bir kez** işlem yapılır; basılı tutmak değeri sürekli artırmaz.

---

## 10. Kod Yürüyüşündeki Açıklamalar

Her C kodu bloğu için `ExplanationCard` bileşeni şu konuları detaylandırır:

### Konfigürasyon ve Pin Tanımları
- `#pragma config` ile HS modu, watchdog ve güç ayarlarının amacı.
- `#define` ile pin isimlendirmenin okunabilirliği.
- `TRISB = 0x0F` (giriş) ve `TRISD = 0x00` (çıkış) ayarları.

### LCD Fonksiyonları
- 4-bit mod nedir ve 8-bit'ten farkı nedir?
- `Lcd_Hazirla()` başlatma sırası: 0x30 → 0x20 → 0x28 → 0x0C → 0x06 → 0x01.
- `RS`, `EN` ve `PORTD` kullanımı; komut ve veri ayrımı.

### Timer1 Kesmesi
- 20MHz + 1:8 prescaler ile 50ms taşma hesabı.
- `TMR1H = 0x86`, `TMR1L = 0x02` ön yükleme değerleri.
- `kesme_sayaci` 20 olunca saniye artışı ve taşıma kontrolleri.
- `GIE`, `TMR1IE`, `PEIE` kesme izinleri.

### Buton Kontrolleri
- Debounce (bas-çek) nedir ve mekanik nedenlerden kaynaklanan sorunlar.
- Yükselen kenar (`rising-edge`) algılama mantığı.
- `b_eski` değişkenlerinin rolü.
- Saat/dakika sınır kontrolleri (0→23, 59→0).

---

## 11. Takım ve Proje Bilgileri

**Takım 5-56** — Manisa Celal Bayar Üniversitesi  
Elektrik Elektronik Mühendisliği & Bilgisayar Mühendisliği  
Disiplinler Arası Proje — 2025-2026

| Ad | Rol |
|----|-----|
| Mehmet Harun Dedecengiz | Devre kurulumu, sistem testleri, kutu tasarımı |
| Kıraç Çağıl Aslan | Proteus simülasyonu, MPLAB X IDE yazılımı |
| Yusuf Eren Bozkurt | Web simülasyonu (Next.js, animasyonlar, i18n) |
| Alper Tekin | Proje dokümantasyonu ve destek |

---

## 12. Geliştirme Ortamı ve Çalıştırma

```bash
# Depoyu klonla
git clone https://github.com/YusuffEren/PIC16F877A.git
cd PIC16F877A

# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu başlat
npm run dev

# Tarayıcıda aç
# http://localhost:3000/tr → Türkçe
# http://localhost:3000/en → English

# Production build
npm run build
```

---

## 13. Ek Notlar

- **Tüm SVG donanım çizimleri** manuel olarak kodlanmıştır; harici resim kullanılmamıştır.
- **Renk paleti:** Dark mode temelli, breadboard üzerinde neon mavi LCD arka ışığı ve her buton için ayrı renk kodu.
- **Performans:** `useClockStore` ve `useInterruptTimer` ile re-render optimizasyonu sağlanır; LCD sadece zaman değiştiğinde animasyon geçişi uygular.
- **Erişilebilirlik:** Butonlar pointer events ile dokunmatik ve mouse desteği sunar; etiketler her zaman görünür.

---

*Bu proje, mikrodenetleyici tabanlı sistemlerin web ortamında görselleştirilmesi ve eğitim amaçlı kullanımı için bir örnek teşkil etmektedir.*
