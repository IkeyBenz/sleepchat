import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  hasGroup;
  constructor(public navCtrl: NavController,
    private afAuth: AngularFireAuth,
    private afDb: AngularFireDatabase) {

  }
  ionViewDidLoad() {
    if (this.afAuth.auth.currentUser) {
      this.checkShit();
    } else {
      this.navCtrl.push('LoginPage');
    }
  }
  async checkShit() {
    let uid = this.afAuth.auth.currentUser.uid;
    let hasGroup = await this.afDb.database.ref(`Users/${uid}/group`).once('value');
    if (hasGroup.val()) {
      this.hasGroup = true;
    }
  }
  createGroup() {
    this.navCtrl.push('CreatePage');
  }
  joinGroup() {
    this.navCtrl.push('JoinPage');
  }

}
