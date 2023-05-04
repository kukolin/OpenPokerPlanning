import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/compat/database';

@Injectable({
  providedIn: 'root'
})
export class FirebaseRealtimeService {
  private userPath = "/users"
  private usersRef: AngularFireList<String>
  private voteRevealStatusPath = "/revealStatus"
  private voteRevealStatusRef: AngularFireObject<String>
  private roomsPath = "/rooms"
  private roomsRef: AngularFireList<String>

  constructor(private db: AngularFireDatabase) {
    this.usersRef = db.list(this.userPath)
    this.voteRevealStatusRef = db.object(this.voteRevealStatusPath)
    this.roomsRef = db.list(this.roomsPath)
  }

  // public saveUser(userName: string, currentRoom: string) {
  //   this.db.database.ref(this.roomsPath + "/" + currentRoom + this.userPath).child(userName).set(0)
  // }

  public getUsersReference(currentRoom: string) {
    return this.db.list(this.roomsPath + "/" + currentRoom + this.userPath)
  }

  public setVoteNumber(userName: string, voteNumber: number, currentRoom: string) {
    this.db.database.ref(this.roomsPath + "/" + currentRoom + this.userPath).child(userName).set(voteNumber)
  }

  public setVoteRevealStatus(status: boolean, currentRoom: string) {
    this.db.database.ref(this.roomsPath + "/" + currentRoom + this.voteRevealStatusPath).set(status)
  }

  public getVoteRevealStatus(currentRoom: string) {
    return this.db.object(this.roomsPath + "/" + currentRoom + this.voteRevealStatusPath)
  }

  public resetPeople(currentRoom: string) {
    this.db.database.ref(this.roomsPath + "/" + currentRoom + this.userPath).set(null)
  }

  public deleteUser(userName: string, currentRoom: string) {
    this.db.database.ref(this.roomsPath + "/" + currentRoom + this.userPath).child(userName).set(null)
  }

  public createRoom(roomName: string): string | null {
    var key = this.db.database.ref(this.roomsPath).push().key
    this.db.database.ref(this.roomsPath + "/" + key).set({
      key: key, 
      name: roomName,
      revealStatus: false,
      users: {}
    })
    return key
  }
}
