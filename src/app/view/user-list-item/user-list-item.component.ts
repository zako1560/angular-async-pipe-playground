import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { User } from 'src/app/user';

@Component({
  selector: 'user-list-item',
  templateUrl: './user-list-item.component.html',
  styleUrls: ['./user-list-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserListItemComponent implements OnInit {

  @Input() user!: User;

  constructor() { }

  ngOnInit(): void {
  }

}
