import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

interface MenuItem {
  name: string,
  route: string
}

@Component({
  selector: 'side-menu',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
  ],
  templateUrl: './side-menu.component.html',
  styleUrl: './side-menu.component.css'
})
export class SideMenuComponent {

  public menuItems: MenuItem[] = [
    {name: 'FullScreen', route: '/maps/fullscreen'},
    {name: 'ZoomRange',  route: '/maps/zoom-range'},
    {name: 'Markers',    route: '/maps/markers'},
    {name: 'Properties', route: '/maps/properties'},
    {name: 'alone', route: '/alone'},
  ]

}
