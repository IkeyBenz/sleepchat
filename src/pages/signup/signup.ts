import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Toast } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { ToastController } from 'ionic-angular';
import { HomePage } from '../home/home';


@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {
  firstName: string;
  lastName: string;
  email: string;
  password: string;

  constructor(public navCtrl: NavController, 
              private afAuth: AngularFireAuth, 
              private afDatabase: AngularFireDatabase,
              private toastController: ToastController) 
  {}

  signup() {
    this.showToast("Hello thre");
    this.afAuth.auth.createUserWithEmailAndPassword(this.email, this.password)
    .then(() => {
      this.afAuth.auth.signInWithEmailAndPassword(this.email, this.password);
    })
    .then(() => {
      let uid = this.afAuth.auth.currentUser.uid;
      this.afDatabase.database.ref(`Users/${uid}`).set({
        firstName: this.firstName,
        lastName: this.lastName
      });
    })
    .then(() => {
      this.showToast('Created your account');
      this.navCtrl.push(HomePage);
    })
    .catch(error => {
      this.showToast(error.message);
    });
  }
  showToast(message) {
    this.toastController.create({
      message: message,
      duration: 3000,
      position: 'bottom'
    }).present();
  }

}
