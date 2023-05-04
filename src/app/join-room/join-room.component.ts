import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseRealtimeService } from '../services/database/firebase-realtime.service';

@Component({
  selector: 'app-join-room',
  templateUrl: './join-room.component.html',
  styleUrls: ['./join-room.component.scss']
})
export class JoinRoomComponent implements OnInit {

  public roomNameInput: string = ""

  constructor(private dbService: FirebaseRealtimeService, private router: Router) { }

  ngOnInit(): void {
  }

  joinRoomSend() {}

  createRoom(){
    var key = this.dbService.createRoom("LucasRoom")
    this.router.navigate(["/mainRoom/" + key])
  }
}
