import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { ToastController } from 'ionic-angular';


@Component({
  selector: 'page-join',
  templateUrl: 'join.html',
})
export class JoinPage {
  groupCode = "";
  currentUser;
  userName;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private afAuth: AngularFireAuth,
    private afDb: AngularFireDatabase,
    private toastController: ToastController) {
  }
  
  joinGroup() {
    if (this.groupCode != "") {
      this.afDb.database.ref('Groups').orderByChild('password').equalTo(this.groupCode).once('value')
      .then(snapshot => {
        if (snapshot.val()) {
          this.afDb.database.ref(`Users/${this.currentUser.uid}/group`).set(snapshot.key);
          this.getCurrentMemberIndex(snapshot.key).then(index => {
            this.afDb.database.ref(`Groups/${snapshot.key}/members/${index}`).set(this.userName);
            this.navCtrl.setRoot('GroupChatPage');
          });
        } else {
          this.showToast("Choose a group that actually exists, moron.");
        }
      })
    } else {
      this.showToast('Dumbass enter a code first');
    }
  }
  ionViewDidLoad() {
    // this.afAuth.auth.onAuthStateChanged(user => {
    //   if (user) {
    //     this.currentUser = user;
    //   } else {
    //     this.showToast("You're not logged in.");
    //     this.navCtrl.setRoot('LoginPage');
    //   }
    // });
  }
  getCurrentMemberIndex(groupId) {
    return new Promise(function(resolve, reject) {
      this.afDb.database.ref(`Groups/${groupId}/members`).once('value')
      .then(snapshot => {
        if (snapshot.val()) {
          resolve(snapshot.val().length);
        } else {
          resolve(0);
        }
      });
    });
  }
  getUserName(user) {
    this.afDb.database.ref(`Users/${user.uid}/firstName`).once('value')
    .then(snapshot => {
      this.userName = snapshot.val();
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
