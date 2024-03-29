import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import mapboxgl, { LngLat, Marker } from 'mapbox-gl';

@Component({
  templateUrl: './markers-page.component.html',
  styleUrl: './markers-page.component.css'
})
export class MarkersPageComponent implements AfterViewInit {

  @ViewChild('map')
  public divMap?: ElementRef;

  public currentZoom: number = 12;
  public map?: mapboxgl.Map;
  public currentLngLat: LngLat = new LngLat(-76.5225, 3.43722);

  ngAfterViewInit(): void {
    if(!this.divMap) throw Error('HTML element not found.')

    this.map = new mapboxgl.Map({
      container: this.divMap?.nativeElement, // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: this.currentLngLat, // starting position [lng, lat]
      zoom: this.currentZoom, // starting zoom
    });

    this.mapListeners();

    const marker = new Marker({
      color: 'green'
    })
      .setLngLat(this.currentLngLat)
      .addTo(this.map);

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

    this.map.on('move', (env) => {
      this.currentLngLat = this.map!.getCenter();
    })
  }

}
