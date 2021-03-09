import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { register } from 'timeago.js';
import Backend from 'i18next-http-backend';

i18n.use(initReactI18next).use(Backend).init({
  // resources: {
  //   en: {
  //     translations: {
  //       'Sign Up': 'Sign Up',
  //       'Password mismatch': 'Password mismatch',
  //       Username: 'Username',
  //       'E-mail': 'E-Mail',
  //       Password: 'Password',
  //       'Password Repeat': 'Password Repeat',
  //       'E-mail verification failure': 'E-mail verification failure',
  //       'Activation E-mail sent': 'An account activation e-mail is sent to {{address}}',
  //       Login: 'Login',
  //       'Account activation failure': 'Account activation failed',
  //       'Activation in progress': 'Activation in progress',
  //       'Your account is activated': 'Your account is activated',
  //       Logout: 'Logout',
  //       Users: 'Users',
  //       Next: 'next >',
  //       Previous: '< previous',
  //       'Load Failure': 'Load Failure',
  //       'User not found': 'User not found',
  //       Edit: 'Edit',
  //       'Change Username': 'Change Username',
  //       Save: 'Save',
  //       Cancel: 'Cancel',
  //       'My Profile': 'My Profile',
  //       'There are no hoaxes': 'There are no hoaxes',
  //       'Load old hoaxes': 'Load old hoaxes',
  //       'There are new hoaxes': 'There are new hoaxes',
  //       'Delete Hoax': 'Delete Hoax',
  //       'Are you sure to delete hoax?': 'Are you sure to delete hoax?',
  //       'Delete My Account': 'Delete My Account',
  //       'Are you sure to delete your account?': 'Are you sure to delete your account?'
  //     }
  //   },
  //   tr: {
  //     translations: {
  //       'Sign Up': 'Kayıt Ol',
  //       'Password mismatch': 'Aynı şifreyi giriniz',
  //       Username: 'Kullanıcı Adı',
  //       'E-mail': 'E-Posta',
  //       Password: 'Şifre',
  //       'E-mail verification failure': 'E-posta adresiniz doğrulanamadı',
  //       'Activation E-mail sent': 'Hesabınızı aktifleştirmek için e-posta adresiniz {{address}} i kontrol edin',
  //       'Password Repeat': 'Şifreyi Tekrarla',
  //       Login: 'Sisteme Gir',
  //       'Account activation failure': 'Hesabınız aktifleştirilemedi',
  //       'Activation in progress': 'Hesabınız aktifleştiriliyor',
  //       'Your account is activated': 'Hesabınız aktifleştirilmiştir',
  //       Logout: 'Çık',
  //       Users: 'Kullanıcılar',
  //       Next: 'sonraki >',
  //       Previous: '< önceki',
  //       'Load Failure': 'Liste alınamadı',
  //       'User not found': 'Kullanıcı bulunamadı',
  //       Edit: 'Düzenle',
  //       'Change Username': 'Kullanıcı adınızı değiştirin',
  //       Save: 'Kaydet',
  //       Cancel: 'İptal Et',
  //       'My Profile': 'Hesabım',
  //       'There are no hoaxes': 'Hoax bulunamadı',
  //       'Load old hoaxes': 'Geçmiş Hoaxları getir',
  //       'There are new hoaxes': 'Yeni Hoaxlar var',
  //       'Delete Hoax': `Hoax'u sil`,
  //       'Are you sure to delete hoax?': `Hoax'u silmek istedğinizden emin misiniz?`,
  //       'Delete My Account': 'Hesabımı Sil',
  //       'Are you sure to delete your account?': 'Hesabınızı silmek istediğinizden emin misiniz?'
  //     }
  //   }
  // },
  fallbackLng: 'en',
  ns: ['translations'],
  defaultNS: 'translations',
  keySeparator: false,
  interpolation: {
    escapeValue: false,
    formatSeparator: ','
  },
  react: {
    wait: true
  }
});

const timeagoTR = (number, index) => {
  return [
    ['az önce', 'şimdi'],
    ['%s saniye önce', '%s saniye içinde'],
    ['1 dakika önce', '1 dakika içinde'],
    ['%s dakika önce', '%s dakika içinde'],
    ['1 saat önce', '1 saat içinde'],
    ['%s saat önce', '%s saat içinde'],
    ['1 gün önce', '1 gün içinde'],
    ['%s gün önce', '%s gün içinde'],
    ['1 hafta önce', '1 hafta içinde'],
    ['%s hafta önce', '%s hafta içinde'],
    ['1 ay önce', '1 ay içinde'],
    ['%s ay önce', '%s ay içinde'],
    ['1 yıl önce', '1 yıl içinde'],
    ['%s yıl önce', '%s yıl içinde']
  ][index];
};
register('tr', timeagoTR);

export default i18n;
