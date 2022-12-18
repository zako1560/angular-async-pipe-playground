import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { User } from '../../user';

@Component({
  selector: 'user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserListComponent implements OnInit {

  @Input() users!: User[];

  constructor() { }

  ngOnInit(): void {
  }

}
