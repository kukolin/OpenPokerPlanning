import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HasUsernameGuard } from './guards/has-username.guard';
import { JoinRoomComponent } from './join-room/join-room.component';
import { MainRoomComponent } from './main-room/main-room.component';
import { UserInputComponent } from './user-input/user-input.component';

const routes: Routes = [
  { path: "mainRoom/:id", component: MainRoomComponent, canActivate:[HasUsernameGuard] },
  { path: "mainRoom", component: JoinRoomComponent },
  { path: "joinRoom", component: JoinRoomComponent },
  { path: "user-input/:id", component: UserInputComponent},
  { path: "**", component: UserInputComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
