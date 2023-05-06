import { Injectable } from '@angular/core';
import {getCookie,setCookie,removeCookie} from 'typescript-cookie'
import jwt_decode,{JwtPayload} from 'jwt-decode';
@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor() { }
  saveToken(token:string){
    // localStorage.setItem('token',token);
    setCookie('token-trello',token,{expires:365,path:'/'});
  }
  getToken(){
    // const token = localStorage.getItem('token')
    const token = getCookie('token-trello')
    return token;
  }
  removeToken(){
    removeCookie('token-trello');
    // localStorage.removeItem('token');
  }
  saveRefreshToken(token:string){
    // localStorage.setItem('token',token);
    setCookie('refresh-token-trello',token,{expires:365,path:'/'});
  }
  getRefreshToken(){
    // const token = localStorage.getItem('token')
    const token = getCookie('refresh-token-trello')
    return token;
  }
  removeRefreshToken(){
    removeCookie('refresh-token-trello');
    // localStorage.removeItem('token');
  }
  isValidToken(){
    const token = this.getToken();
    if(!token){
      return false;
    }
    const decodeToken = jwt_decode<JwtPayload>(token);
    if(decodeToken && decodeToken?.exp){
      const tokenDate = new Date(0);
      const today = new Date();
      tokenDate.setUTCSeconds(decodeToken?.exp);
      // console.log(tokenDate.getTime());
      console.log(tokenDate.getTime() - today.getTime());
      return tokenDate.getTime() > today.getTime();
    }
    return false;
  }
  isValidRefreshToken(){
    const token = this.getRefreshToken();
    if(!token){
      return false;
    }
    const decodeToken = jwt_decode<JwtPayload>(token);
    if(decodeToken && decodeToken?.exp){
      const tokenDate = new Date(0);
      const today = new Date();
      tokenDate.setUTCSeconds(decodeToken?.exp);
      // console.log(tokenDate.getTime());
      console.log(tokenDate.getTime() - today.getTime());
      return tokenDate.getTime() > today.getTime();
    }
    return false;
  }
}