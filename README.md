# 🤖 Booms Bot - Discord Moderasyon Botu

Türkçe dilinde, slash komutlarla çalışan profesyonel bir Discord moderasyon botu.

## 📋 Özellikler

- ✅ Tamamen slash komut (/) sistemi
- ⚠️ Kalıcı warn (uyarı) sistemi
- 👢 Kick ve ban komutları
- 📢 Duyuru sistemi
- 🔐 Rol tabanlı yetkilendirme
- 💾 JSON tabanlı veri saklama
- 🇹🇷 Türkçe dil desteği

## 🎯 Komutlar

| Komut | Açıklama | Parametreler |
|-------|----------|--------------|
| `/warn` | Kullanıcıya uyarı verir | kullanıcı, sebep |
| `/unwarn` | Belirli bir uyarıyı kaldırır | kullanıcı, sıra |
| `/clearwarn` | Tüm uyarıları temizler | kullanıcı |
| `/warnlist` | Uyarı geçmişini gösterir | kullanıcı |
| `/kick` | Kullanıcıyı sunucudan atar | kullanıcı, sebep (opsiyonel) |
| `/ban` | Kullanıcıyı yasaklar | kullanıcı, sebep (opsiyonel), mesaj-sil (opsiyonel) |
| `/duyuru` | Belirtilen kanala duyuru gönderir | kanal, başlık, mesaj, renk (opsiyonel), görsel (opsiyonel) |

## 📦 Kurulum

### 1. Gereksinimler

- Node.js v18.0.0 veya üzeri
- npm (Node.js ile birlikte gelir)
- Bir Discord hesabı

### 2. Discord Bot Oluşturma

1. [Discord Developer Portal](https://discord.com/developers/applications)'a gidin
2. "New Application" butonuna tıklayın
3. Botunuza bir isim verin (örn: Booms Bot)
4. Sol menüden "Bot" sekmesine gidin
5. "Add Bot" butonuna tıklayın
6. "Reset Token" butonuna tıklayıp TOKEN'ı kopyalayın (Bu token'ı kimseyle paylaşmayın!)
7. Aşağı kaydırıp **Privileged Gateway Intents** bölümünden şu ayarları aktif edin:
   - ✅ SERVER MEMBERS INTENT
   - ✅ MESSAGE CONTENT INTENT

### 3. Bot Yetkilerini Ayarlama

1. Sol menüden "OAuth2" → "URL Generator" sekmesine gidin
2. **SCOPES** bölümünden şunları seçin:
   - ✅ bot
   - ✅ applications.commands
3. **BOT PERMISSIONS** bölümünden şunları seçin:
   - ✅ Kick Members
   - ✅ Ban Members
   - ✅ Send Messages
   - ✅ Manage Messages
   - ✅ Read Message History
4. En alttaki URL'yi kopyalayıp tarayıcıya yapıştırın
5. Botu eklemek istediğiniz sunucuyu seçin ve "Authorize" butonuna tıklayın

### 4. CLIENT ID'yi Bulma

1. Discord Developer Portal'da uygulamanızın sayfasında
2. Sol menüden "General Information" sekmesine gidin
3. "APPLICATION ID" değerini kopyalayın (Bu sizin CLIENT_ID'nizdir)

### 5. Projeyi İndirme ve Kurma

```bash
# Proje klasörüne gidin
cd booms-bot

# Bağımlılıkları yükleyin
npm install
```

### 6. .env Dosyasını Yapılandırma

`.env.example` dosyasını kopyalayıp `.env` olarak adlandırın:

```bash
# Windows için
copy .env.example .env

# Mac/Linux için
cp .env.example .env
```

`.env` dosyasını bir metin editörü ile açın ve şu bilgileri girin:

```env
BOT_TOKEN=buraya_discord_bot_tokeninizi_yapiştirin
CLIENT_ID=buraya_application_id_yapiştirin
```

**Önemli:** `.env` dosyası gizli bilgiler içerir, kimseyle paylaşmayın!

### 7. Yetkili Rol ID'sini Ayarlama

Botun komutlarını kullanabilecek rolün ID'sini bulun:

1. Discord'da Developer Mode'u açın (Ayarlar → Gelişmiş → Geliştirici Modu)
2. Sunucunuzda Roller bölümüne gidin
3. İlgili role sağ tık yapıp "Rol Kimliğini Kopyala" seçin
4. Her komut dosyasındaki (`commands/` klasöründe) `YETKILI_ROL_ID` değerini değiştirin

**Varsayılan değer:** `1463878849510113450`

Tüm komut dosyalarında bu satırı bulup kendi rol ID'nizi yazın:

```javascript
const YETKILI_ROL_ID = 'BURAYA_KENDI_ROL_ID_NIZI_YAZIŞTIRIN';
```

### 8. Botu Başlatma

```bash
node index.js
```

Başarılı olursa şu mesajları göreceksiniz:

```
✅ Komut yüklendi: warn
✅ Komut yüklendi: unwarn
✅ Komut yüklendi: clearwarn
✅ Komut yüklendi: warnlist
✅ Komut yüklendi: kick
✅ Komut yüklendi: ban
✅ Komut yüklendi: duyuru
🔄 7 slash komut Discord'a kaydediliyor...
✅ Komutlar global olarak kaydedildi!
🤖 Bot aktif! BoomsBot#1234 olarak giriş yapıldı.
📊 1 sunucuda aktif
```

## 🧪 Test Modu (Hızlı Komut Güncellemesi)

Global komutlar Discord'a yansımak için 1 saat kadar sürebilir. Hızlı test için guild bazlı komut kullanabilirsiniz:

1. Discord sunucu ID'nizi bulun (Sunucuya sağ tık → "Sunucu Kimliğini Kopyala")
2. `.env` dosyasına ekleyin:

```env
GUILD_ID=buraya_sunucu_id_yapiştirin
```

3. Botu yeniden başlatın - komutlar anında güncellenir!

## 📚 Kullanım Örnekleri

### Warn Sistemi

```
/warn kullanıcı:@Kullanıcı sebep:Küfür kullandı
/warnlist kullanıcı:@Kullanıcı
/unwarn kullanıcı:@Kullanıcı sıra:1
/clearwarn kullanıcı:@Kullanıcı
```

### Moderasyon

```
/kick kullanıcı:@Kullanıcı sebep:Sürekli spam yapıyor
/ban kullanıcı:@Kullanıcı sebep:Troll hesap mesaj-sil:7
```

### Duyuru

```
/duyuru kanal:#duyurular başlık:Yeni Etkinlik mesaj:Yarın saat 20:00'de turnuva var!
```

## 🔧 Sorun Giderme

### Bot çevrimiçi ama komutlar çalışmıyor

- Komutların yüklenmesi global modda 1 saat sürebilir
- Hızlı test için `.env` dosyasına `GUILD_ID` ekleyin
- Botu yeniden başlatın

### "Bu komutu kullanmak için gerekli yetkiye sahip değilsiniz" hatası

- Komut dosyalarındaki `YETKILI_ROL_ID` değerini kontrol edin
- Kullanıcının bu role sahip olduğundan emin olun

### "Bu kullanıcıyı atamıyorum" hatası

- Botun rolü, atmak istediğiniz kişinin rolünden yüksek olmalı
- Bot yetkilerini kontrol edin (Kick/Ban Members)

### Türkçe karakterler bozuk görünüyor

- Tüm dosyaların UTF-8 kodlamasıyla kaydedildiğinden emin olun
- Terminal/konsol Türkçe karakter desteklemiyorsa kullanımda sorun olmaz

## 🚀 İleri Seviye Özellikler (Gelecekte Eklenebilir)

- [ ] Otomatik mod log kanalı
- [ ] Warn sayısına göre otomatik kick/ban
- [ ] Embed mesajlar
- [ ] Mute/timeout sistemi
- [ ] Çoklu dil desteği
- [ ] Web dashboard

## 📝 Lisans

MIT License - Dilediğiniz gibi kullanabilir ve değiştirebilirsiniz.

## 💡 Destek

Sorun yaşıyorsanız:
1. Bu README dosyasını tekrar okuyun
2. Hata mesajlarını kontrol edin
3. `.env` dosyanızı ve rol ID'lerini kontrol edin

---

**Geliştirici Notu:** Bu bot modüler bir yapıda tasarlanmıştır. Yeni komutlar eklemek için `commands/` klasörüne yeni dosyalar ekleyin ve botun yapısını takip edin.
