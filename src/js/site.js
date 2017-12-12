import Auth from 'auth';
import Kaleidoscope from 'kaleidoscope';

if (document.body.classList.contains('index')) {
  new Auth;  
}   

if (document.body.classList.contains('visualizer')) {
  window.KALEIDOSCOPE = new Kaleidoscope('kaleidoscope');
}  