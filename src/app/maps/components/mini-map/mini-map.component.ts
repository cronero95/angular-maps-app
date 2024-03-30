import { Component, Input, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import mapboxgl, { LngLat, Marker } from 'mapbox-gl';

@Component({
  selector: 'maps-mini-map',
  templateUrl: './mini-map.component.html',
  styleUrl: './mini-map.component.css',
})
export class MiniMapComponent implements AfterViewInit {

  @Input()
  lngLat?: [number, number];

  @ViewChild('map')
  public divMap?: ElementRef;

  public map?: mapboxgl.Map;

  ngAfterViewInit(): void {
    if(!this.divMap) throw Error('HTML element not found.')
    if(!this.lngLat) throw Error("lngLat can't be null.")

    this.map = new mapboxgl.Map({
      container: this.divMap?.nativeElement, // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: this.lngLat, // starting position [lng, lat]
      zoom: 15, // starting zoom
      interactive: false,
    });

    const color = '#xxxxxx'.replace(/x/g, y=>(Math.random()*16|0).toString(16));

    new Marker({
      color
    })
      .setLngLat(this.lngLat)
      .addTo(this.map)
  }

}
