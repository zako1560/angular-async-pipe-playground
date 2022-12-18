import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject } from "rxjs";
import { map } from "rxjs/operators";
import { User } from "../user";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private usersSubject = new BehaviorSubject<User[]>([]);

  get users$() {
    return this.usersSubject.asObservable();
  }

  constructor(private http: HttpClient) {}

  fetchUsers(): void {
    this.http
      .get<{ data: User[] }>("https://reqres.in/api/users")
      .pipe(map(resp => resp.data))
      .subscribe(users => {
        this.usersSubject.next(users);
      });
  }
}
