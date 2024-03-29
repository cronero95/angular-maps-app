import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import mapboxgl from 'mapbox-gl';

@Component({
  templateUrl: './zoom-range-page.component.html',
  styleUrl: './zoom-range-page.component.css'
})
export class ZoomRangePageComponent implements AfterViewInit {

  @ViewChild('map')
  public divMap?: ElementRef;

  public currentZoom: number = 10;
  public map?: mapboxgl.Map;

  ngAfterViewInit(): void {
    if(!this.divMap) throw Error('HTML element not found.')

    this.map = new mapboxgl.Map({
      container: this.divMap?.nativeElement, // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: [-74.5, 40], // starting position [lng, lat]
      zoom: this.currentZoom, // starting zoom
    });

    this.mapListeners();

  }

  mapListeners(): void {
    if(!this.map) throw Error('Uninitialized map');

    this.map.on('zoom', (event) => {
      this.currentZoom = this.map!.getZoom();
    });

    this.map.on('zoomend', (event) => {
      if(this.map!.getZoom() < 18) return;

      this.map!.zoomTo(18);
    })
  }

  zoomIn(): void {
    this.map?.zoomIn();
  }

  zoomOut(): void {
    this.map?.zoomOut();
  }

  zoomChanged(value: string): void {
    this.currentZoom = Number(value);
    this.map?.zoomTo(this.currentZoom);
  }

}
