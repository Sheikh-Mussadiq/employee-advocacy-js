export function initializeShareThis() {
  if (window.__sharethis__) {
    window.__sharethis__.load('inline-share-buttons', {
      alignment: 'center',
      font_size: 16,
      has_spacing: true,
      networks: ['linkedin', 'twitter', 'facebook', 'email'],
      padding: 12,
      radius: 4,
      show_total: false,
      size: 40,
      show_mobile_buttons: true,
      min_count: 0,
      url: window.location.href,
      title: 'Check out my post',
      username: '',
      message: '',
      subject: 'Check out my post',
      onLoad: () => {
        console.log('ShareThis loaded successfully');
      },
      onError: () => {
        console.error('ShareThis failed to load');
      },
      cors_allowed_origins: '*',
      image_preview: false,
      protocol: 'https'
    });
  }
}