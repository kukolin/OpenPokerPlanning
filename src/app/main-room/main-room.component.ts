import { Component, OnInit } from '@angular/core';
import { FirebaseRealtimeService } from '../services/database/firebase-realtime.service';
import { abailableNumbers } from '../models/AbailableVoteNumbers';
import { LocalStorageService } from '../services/local-storage.service';
import { User } from '../models/User';
import { ActivatedRoute, Router } from '@angular/router';
import { Clipboard } from '@angular/cdk/clipboard';
import confetti from 'canvas-confetti';
import { animate, style, transition, trigger } from '@angular/animations';

const leaveTrans = transition(':leave', [
  style({
    opacity: 1
  }),
  animate('1s ease-out', style({
    opacity: 0
  }))
])

const fadeOut = trigger('fadeOut', [
  leaveTrans
]);

@Component({
  selector: 'app-main-room',
  templateUrl: './main-room.component.html',
  styleUrls: ['./main-room.component.scss'],
  animations: [
    fadeOut
  ]
})
export class MainRoomComponent implements OnInit {

  public userList: User[] = [];
  public cardNumbers: number[] = abailableNumbers
  public voteRevealed = false
  public myName: string = "";
  public roomId = ""

  public average: number = 0;
  public mode: number[] = [];
  public mostrar = false;

  constructor(
    private dbService: FirebaseRealtimeService,
    private localStorage: LocalStorageService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private clipboard: Clipboard
    ) {
      this.roomId = this.activatedRoute.snapshot.paramMap.get("id") || ""
       //TODO: Hacer un handle de error cuando no encuentra la sala con este id. Puede ser un redirect a una pagina de error

      this.suscribeToUsers()
      this.suscribeToVotes()

      this.myName = this.localStorage.get("user") || ""
  }

  ngOnInit(): void {
  }

  setVote(num: number) { 
    this.dbService.setVoteNumber(this.myName, num, this.roomId)
  }

  revealVotes() {
    this.dbService.setVoteRevealStatus(!this.voteRevealed, this.roomId)
    if(this.votoUnanime() && this.voteRevealed == false) this.confettis()
  } 
   
  resetVotes() {
    this.userList.forEach(user => {
      this.dbService.setVoteNumber(user.name, -1, this.roomId)
    })
    this.dbService.setVoteRevealStatus(false, this.roomId)
  }

  resetPeople() {
    this.dbService.resetPeople(this.roomId)
  }
  
  editName(){
    this.localStorage.remove("user")
    this.dbService.deleteUser(this.myName, this.roomId)
    this.router.navigate(['/user-input/' + this.roomId]);
  }

  copyRoomId() {
    this.clipboard.copy(this.roomId);
  }

  copyRoomLink() {
    this.clipboard.copy("https://freya-planning-poker.web.app/mainRoom/" + this.roomId);
  }

  private suscribeToUsers() {
    this.dbService.getUsersReference(this.roomId).snapshotChanges().subscribe(result => {
      this.userList = result.map(v => {return { name: v.key || "", vote: Number(v.payload.val()) || 0 }})
      this.refreshStatistics()
    })
  }

  private suscribeToVotes() {
    this.dbService.getVoteRevealStatus(this.roomId).snapshotChanges().subscribe(result => {
      this.voteRevealed = (result.payload.val() == true)
      this.refreshStatistics()
    })
  }

  private refreshStatistics() {
    if(this.voteRevealed) {
      this.refreshAverage()
      this.refreshMode()
    }
    else {
      this.average = NaN
      this.mode = []
    }
  }

  private refreshAverage() {
    var sum = 0;
    var filteredList = this.userList.filter(user => user.vote > 0)
    filteredList.forEach(user => sum += user.vote)
    console.log(this.userList)
    this.average = sum / filteredList.length
  }

  private refreshMode() {
    this.mode = this.calculateMode(this.userList.filter(u => u.vote > 0).map(u => u.vote))
  }

  private calculateMode(numbers: number[]): number[] {
      let frequency: { [key: number]: number } = {};
      let maxFrequency = 0;
      let modes: number[] = [];
    
      numbers.forEach((number) => {
        frequency[number] = frequency[number] ? frequency[number] + 1 : 1;
    
        if (frequency[number] > maxFrequency) {
          maxFrequency = frequency[number];
        }
      });
    
      for (const number in frequency) {
        if (frequency[number] === maxFrequency) {
          modes.push(+number);
        }
      }
    
      return modes;
  }

  private votoUnanime() {
    if(this.userList.length == (0 || 1)) return false
    var firstVote = this.userList[0].vote
    var result = true
    this.userList.forEach(user => {
      if(user.vote != firstVote) result = false
    })
    return result
  }

  private confettis() {
    var duration = 500;
    var end = Date.now() + duration;
    this.mostrarTexto();

    (function frame() {
      // launch a few confetti from the left edge
      confetti({
        particleCount: 7,
        angle: 60,
        spread: 55,
        origin: { x: 0 , y: 1 }
      });
      // and launch a few from the right edge
      confetti({
        particleCount: 7,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 1 }
      });

      // keep going until we are out of time
      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  }

  private mostrarTexto() {
    this.mostrar = true;
    setTimeout(() => {
      this.mostrar = false;
    }, 1000);
  }

}
