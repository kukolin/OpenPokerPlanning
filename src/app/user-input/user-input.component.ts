import { Component, OnInit } from '@angular/core';
import { FirebaseRealtimeService } from '../services/database/firebase-realtime.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStorageService } from '../services/local-storage.service';

@Component({
  selector: 'app-user-input',
  templateUrl: './user-input.component.html',
  styleUrls: ['./user-input.component.scss']
})
export class UserInputComponent implements OnInit {

  public value: string = "Tu nombre"
  private roomId: string = ""

  constructor(private dbService: FirebaseRealtimeService, private router: Router, private localStorage: LocalStorageService, private activatedRoute: ActivatedRoute) {
    this.roomId = activatedRoute.snapshot.paramMap.get("id") || ""
  }

  ngOnInit(): void { }

  public saveAndRedirect() {
    this.localStorage.set("user", this.value)
    this.router.navigate(["mainRoom/" + this.roomId]);
  }
}
