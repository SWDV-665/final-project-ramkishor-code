import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { map, catchError } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { UserCrudService } from '../usercrud/userCrud.service';



@Injectable(
  {
    providedIn: 'root'
  }
)
export class billServiceProvider {
items: any = [];
dataChanged$: Observable<boolean>;
private dataChangeSubject: Subject<boolean>;
//baseURL = "http://localhost:8080";
baseURL ="https://billtracker-ram.herokuapp.com";

constructor(
  public http: HttpClient,
   private userCrudService: UserCrudService,
   
   ) {
    console.log('Hello billServiceProvider Provider');
this.dataChangeSubject = new Subject<boolean>();
this.dataChanged$ = this.dataChangeSubject.asObservable();
}




getItems():Observable<any> {
  //this.mainstack();
return this.http.get(this.baseURL + '/api/bill/'+this.userCrudService.logger).
pipe(
  map(this.extractData),
  catchError(this.handleError),

  );

}
getupcomingItems():Observable<any> {
  return this.http.get(this.baseURL + '/api/upcomingbill/'+this.userCrudService.logger).
  pipe(
    map(this.extractData),
    catchError(this.handleError),
  
    );
  
  }
  getpendingItems():Observable<any> {
    return this.http.get(this.baseURL + '/api/pendingbill/'+this.userCrudService.logger).
    pipe(
      map(this.extractData),
      catchError(this.handleError),
    
      );
    
    }

private extractData(res: Response) {
let body = res;
return body || {};
}

private handleError(error: Response | any){
 let errMsg: string; 
 if (error instanceof Response)
 {
  const err = error || '';
   errMsg = '${error.status}';
 } 
 else{
  errMsg = error.message ? error.message : error.toString();
 }
  console.error(errMsg);
   return Observable.throw(errMsg); 
} 
removeItem(item) {
    console.log("#**# Remove Item - id = ", item._id); 
    this.http.delete(this.baseURL + "/api/remove/" + item._id).subscribe (res => {
    this.items = res;
    this.dataChangeSubject.next(true); });
}
    addItem(item) {
         this.http.post(this.baseURL + "/api/bill/add", item). subscribe (res =>{
    this.items = res;
    
    this.dataChangeSubject.next(true);
      });
    }
    editItem( item, index) {
    console.log("Editing item = ", item); this.http.put(this.baseURL + "/api/bill/edit/" + item._id, item). subscribe(res => {
    this.items = res;
    this.dataChangeSubject.next(true); });
       
    }
    paid( item, index) {
      console.log("Editing item = ", item); this.http.put(this.baseURL + "/api/bill/paid/" + item._id, item). subscribe(res => {
      this.items = res;
      this.dataChangeSubject.next(true); });
  
      }

//  mainstack(){
  
//    //this.http.get(this.baseURL + '/api/stack');
//    this.http.get<any>(this.baseURL + '/api/stack').subscribe(data => {
//     console.log("stack running");
//     return 1;    
//     })   
//   }
}