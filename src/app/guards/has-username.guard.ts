import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, Router, ActivatedRoute, UrlTree } from '@angular/router';
import { LocalStorageService } from '../services/local-storage.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HasUsernameGuard implements CanActivate {

  private roomId: string = "a";

  constructor(private localStorage: LocalStorageService, private router: Router, private activatedRoute: ActivatedRoute){};

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree{

      this.roomId = route.paramMap.get("id") || ""

      console.log(route.paramMap)
      console.log(this.localStorage.get("user"))
      let hasUsername = this.localStorage.get("user") != null
      if (hasUsername){
        return true
      } else {
        this.router.navigate(['/user-input/' + this.roomId]);
        return false
      }
  }
  
}