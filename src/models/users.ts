import { AngularFireDatabase } from 'angularfire2/database';
let afDb: AngularFireDatabase;
let db = afDb.database;

export const users = {
    getUser: (userId) => getUserWithId(userId)
}

function getUserWithId(userId) {
    return new Promise(function(resolve, reject) {
        db.ref(`Users/' + ${userId}`).once('value').then(snapshot => {
            if (snapshot.val()) {
                let user = snapshot.val();
                user['key'] = snapshot.key;
                resolve(user);
            } else {
                reject('User not found.');
            }
        });
    });
}
