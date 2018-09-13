import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { ToastController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-group-chat',
  templateUrl: 'group-chat.html',
})
export class GroupChatPage {
  chatFeed = [];
  newMessage = "";
  groupTitle = "";
 

  constructor(public navCtrl: NavController, 
    private afAuth: AngularFireAuth,
    private afDb: AngularFireDatabase,
    private toastController: ToastController) {
  }
  ionViewDidLoad() {
    console.log('loaded gc page');
    this.loadTitle();
    this.loadChat();
  }
  async loadChat() {
    let uid = this.afAuth.auth.currentUser.uid;
    let groupID = await this.afDb.database.ref(`Users/${uid}/group`).once('value');
    let snapshot = await this.afDb.database.ref(`Groups/${groupID.val()}/feed`).once('value');
    this.chatFeed = [];
    if (snapshot.val()) {
      for (let message of snapshot.val()) {
        this.chatFeed.push({
          author: message.author,
          message: message.text
        });
      }
    }
  }
  async postMessage() {
    if (this.newMessage != "") {
      let uid = this.afAuth.auth.currentUser.uid;
      let userName = await this.afDb.database.ref(`Users/${uid}/firstName`).once('value')
      let groupID = await this.afDb.database.ref(`Users/${uid}/group`).once('value');
      let feedIndex = await this.currentFeedIndex();
      this.afDb.database.ref(`Groups/${groupID.val()}/feed/${feedIndex}`).set({
        author: userName.val(),
        text: this.newMessage
      })
      .then(() => {
        this.loadChat()
      })
    } else {
      this.showToast('Message text cannot be empty.');
    }
  }
  async loadTitle() {
    console.log('Loading title');
    if (this.afAuth.auth.currentUser) {
      let uid = this.afAuth.auth.currentUser.uid;
      let groupID = await this.afDb.database.ref(`Users/${uid}/group`).once('value');
      let groupName = await this.afDb.database.ref(`Groups/${groupID.val()}/name`).once('value');
      this.groupTitle = groupName.val();
      console.log('group title is' + this.groupTitle);
    } else {
      this.navCtrl.push('LoginPage');
    }
    
  }
  async currentFeedIndex() {
    let uid = this.afAuth.auth.currentUser.uid;
    let db = this.afDb.database;
    return new Promise(async function(resolve, reject) {
      let groupID = await db.ref(`Users/${uid}/group`).once('value');
      let feed = await db.ref(`Groups/${groupID.val()}/feed`).once('value');
      if (feed.val()) {
        resolve(feed.val().length);
      } else {
        resolve(0);
      }
    });
  }
  showToast(message) {
    this.toastController.create({
      message: message,
      duration: 3000,
      position: 'bottom'
    });
  }
}

