import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { switchMap,tap } from 'rxjs/operators';
import { TokenService } from '@services/token.service'
import { ResponseLogin } from '@models/auth.model';
import { User } from '@models/users.model';
import { BehaviorSubject } from 'rxjs';
import { checkToken } from '@interceptors/token.interceptor';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  apiUrl = environment.API_URL;
  user$ = new BehaviorSubject<User|null>(null);
  constructor(
    private http: HttpClient,
    private tokenService : TokenService
  ) { }

  getDataUser(){
    console.log(this.user$);
    return this.user$.getValue();
  }
  login(email:string,password:string){
    return this.http.post<ResponseLogin>(`${this.apiUrl}/api/v1/auth/login`,{
            email,
            password
          })
          .pipe(
              tap(response =>{
                // console.log(response);
                this.tokenService.saveToken(response.access_token)
                this.tokenService.saveRefreshToken(response.refresh_token)
            })
          );
  }
  register(email:string,password:string,name:string){
    return this.http.post(`${this.apiUrl}/api/v1/auth/register`,{
      email,
      password,
      name
    });
  }
  registerAndLogin(email:string,password:string,name:string){
    return this.register(email,password,name).pipe(
      switchMap(()=>this.login(email,password))
    );

  }
  isAvailable(email:string){
    return this.http.post<{isAvailable:boolean}>(`${this.apiUrl}/api/v1/auth/is-available`,{
      email
    });
  }
  recovery(email:string){
    return this.http.post(`${this.apiUrl}/api/v1/auth/recovery`,{
      email
    });
  }
  changePassword(newPassword:string,token:string){
    return this.http.post(`${this.apiUrl}/api/v1/auth/change-password`,{
      newPassword,
      token
    });
  }
  getProfile(){
    const token = this.tokenService.getToken();
    return this.http.get<User>(`${this.apiUrl}/api/v1/auth/profile`,{
      context: checkToken()
    })
    .pipe(
      tap(user =>{
        this.user$.next(user);
      })
    );
  }
  logout(){
    this.tokenService.removeToken();
  }

  refreshToken(refreshToken:string){
    return this.http.post<ResponseLogin>(`${this.apiUrl}/api/v1/auth/refresh-token`,{
      refreshToken
    })
    .pipe(
      tap(response =>{
        // console.log(response);
        this.tokenService.saveToken(response.access_token)
        this.tokenService.saveRefreshToken(response.refresh_token)
    })
  );
  }

}

