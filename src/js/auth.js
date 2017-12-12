import GetJSON from 'get-json';

class Auth {
  constructor() {
    this.loginButton = document.querySelector('button.login');
    this.events();
  }

  events() {
    this.loginButton.addEventListener('click', (e) => {
      e.preventDefault();

      GetJSON('/get-auth-id', (res) => {
        window.location.href = `/login?auth_id=${res.auth_id}`;
      });
    });
  }
}

export default Auth;