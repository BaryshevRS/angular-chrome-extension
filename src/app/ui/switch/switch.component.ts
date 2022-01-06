import { Component, Input, OnInit } from '@angular/core';

type SwitchSize = 'mini' | 'default'

@Component({
  selector: 'app-switch',
  templateUrl: './switch.component.html',
  styleUrls: ['./switch.component.scss']
})
export class SwitchComponent implements OnInit {

  @Input() size: SwitchSize = 'default'

  constructor() { }

  ngOnInit(): void {
  }
}
