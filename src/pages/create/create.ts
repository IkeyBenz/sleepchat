import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { ToastController } from 'ionic-angular';

@Component({
  selector: 'page-create',
  templateUrl: 'create.html',
})
export class CreatePage {
  groupPassword: string = "";
  groupName: string = "";

  constructor(public navCtrl: NavController, 
    private afDatabase: AngularFireDatabase,
    public afAuth: AngularFireAuth,
    private toastController: ToastController) {

  }
  showToast(message) {
    this.toastController.create({
      message: message,
      duration: 3000,
      position: 'bottom'
    }).present();
  }

  async createGroup() {
    if (this.afAuth.auth.currentUser) {
      this.showToast('There is a logged in user: ' + this.afAuth.auth.currentUser.uid);
      if (this.groupName != "" && this.groupPassword != "") {
        try {
          let userName = await this.getLoggedInUsername();
          let uid = this.afAuth.auth.currentUser.uid;
          let groupID = this.afDatabase.database.ref('Groups/').push().key;
          this.afDatabase.database.ref('Groups/' + groupID).set({
            name: this.groupName,
            password: this.groupPassword,
            members: [`${userName}`]
          });
          this.afDatabase.database.ref(`Users/${uid}/group`).set(groupID);
          console.log('Pushing to gc page');
          this.navCtrl.push('GroupChatPage');
        } catch (error) {
          this.showToast(error);
        }
      } else {
        this.showToast('Please enter the name and password of this group before continuing.');
      }
    } else {
      this.showToast('You are not signed in')
      this.navCtrl.push('SignupPage');      
    }
  }

  getLoggedInUsername() {
    let auth = this.afAuth.auth;
    let db = this.afDatabase.database;
    return new Promise(function(resolve, reject) {
      let uid = auth.currentUser.uid;
      db.ref(`Users/${uid}/firstName`).once('value')
      .then(snapshot => {
        resolve(snapshot.val());
      })
      .catch(error => {
        reject(error.message)
      });
    });
  }
}
