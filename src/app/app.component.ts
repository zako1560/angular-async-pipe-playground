import { Component } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { User } from "./user";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  users$ = this.http
    .get<{ data: User[] }>("https://reqres.in/api/users")
    .pipe(map(resp => resp.data));

  constructor(private http: HttpClient) {}

  ngOnInit() {
  }
}
