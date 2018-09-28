import { AngularFireDatabase } from 'angularfire2/database';
let afDb: AngularFireDatabase;
let db = afDb.database;

export const Groups = {
    getGroupWithId: (id) => get(id),
    createGroupWithNameAndPassword: (name, password) => create(name, password),
    addMemberTo: (groupId, memberName) => addMember(groupId, memberName),
    addPostToFeed: (groupId, post) => postFeed(groupId, post),
    updateName: (groupId, newName) => update(groupId, newName, 'name'),
    updatePassword: (groupId, newPassword) => update(groupId, newPassword, 'password')
}

function get(id) {
    return new Promise(function(resolve, reject) {
        db.ref(`Groups/${id}`).once('value')
        .then(snapshot => {
            if (snapshot.val()) {
                resolve(snapshot.val());
            } else {
                reject(`There is no group with password ${id}`);
            }
        });
    });
}
function create(name, password) {
    return new Promise(function(resolve, reject) {
        db.ref(`Groups`).orderByChild('password').equalTo(name).once('value')
        .then(snapshot => {
            let groups = snapshot.val();
            if (groups) {
                for (let group of groups) {
                    if (group.password == password && group.name == name) {
                        reject('A group with those credentials already exists.');
                    }
                }
            }
        });
        let groupId = db.ref('Groups').push({
            'members': [],
            'name': name,
            'password': password,
            'feed': []
        }).key;
        resolve(groupId);
    });
}
function postFeed(groupId, post) {
    return new Promise(function(resolve, reject) {
        db.ref(`Groups/${groupId}`).once('value').then(snapshot => {
            if (snapshot.val()) {
                let postIndex = snapshot.val().feed.length
                db.ref(`Groups/${groupId}/feed/${postIndex}`).set(post);
                resolve();
            } else {
                reject("Group does not exist.");
            }
        });
    });
}
function addMember(groupId, memberName) {
    return new Promise(function(resolve, reject) {
        db.ref(`Groups/${groupId}`).once('value')
        .then(snapshot => {
            if (snapshot.val()) {
                let index = snapshot.val().members.length || 0;
                db.ref(`Groups/${groupId}/members/${index}`).set(memberName);
                resolve();
            } else {
                reject("Group doesn't exist");
            }
        });
    });
}
function update(groupId, updated, valueType) {
    return new Promise(function(resolve, reject) {
        db.ref(`Groups/${groupId}`).once('value').then(snapshot => {
            if (snapshot.val()) {
                db.ref(`Groups/${groupId}/${valueType}`).set(updated);
                resolve();
            } else {
                reject("Group does not exist.");
            }
        });
    });
}
