import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { HomePage } from '../home/home';


@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  email = "";
  password = "";

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private afAuth: AngularFireAuth,
    private afDatabase: AngularFireDatabase) {
  }

  login() {
    this.afAuth.auth.signInWithEmailAndPassword(this.email, this.password)
    .then(() => {
      this.handleAfterLogin();
    })
  }
  async handleAfterLogin() {
    let uid = this.afAuth.auth.currentUser.uid;
    let usersGroup = await this.afDatabase.database.ref(`Users/${uid}/group`).once('value');
    if (usersGroup.val()) {
      this.navCtrl.push('GroupChatPage');
    } else {
      this.navCtrl.push(HomePage);
    }
  }

}
