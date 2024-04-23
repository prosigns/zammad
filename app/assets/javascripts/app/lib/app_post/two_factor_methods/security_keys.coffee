App.Config.set('SecurityKeys', {
  key:         'security_keys'
  identifier:  'SecurityKeys'
  editable:    true
  label:       __('Security Keys')
  description: __('Complete the sign-in with your security key.')
  helpMessage: __('Complete the sign-in with your security key.')
  icon:        'security-key'
  order:       1000
}, 'TwoFactorMethods')
