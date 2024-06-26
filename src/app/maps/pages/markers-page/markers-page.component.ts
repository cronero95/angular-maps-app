import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import mapboxgl, { LngLat, Marker } from 'mapbox-gl';

interface MarkerAndColor {
  marker: Marker,
  color: string,
}

interface PlainMarker {
  color: string,
  lngLat: number[]
}

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

  public markers: MarkerAndColor[] = [];

  ngAfterViewInit(): void {
    if(!this.divMap) throw Error('HTML element not found.')

    this.map = new mapboxgl.Map({
      container: this.divMap?.nativeElement, // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: this.currentLngLat, // starting position [lng, lat]
      zoom: this.currentZoom, // starting zoom
    });

    this.mapListeners();

    this.readFromLocalStorage();
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

  createMarker(): void {
    if(!this.map) return;

    const color = '#xxxxxx'.replace(/x/g, y=>(Math.random()*16|0).toString(16));

    this.addMarker(this.currentLngLat, color);
  }

  addMarker(lngLat: LngLat, color: string): void {
    if(!this.map) throw Error('Uninitialized map');

    const marker = new Marker({
      color,
      draggable: true
    })
      .setLngLat(lngLat)
      .addTo(this.map)

    this.markers.push({marker, color});

    this.saveToLocalStorage();

    marker.on('dragend', () => this.saveToLocalStorage());
  }

  deleteMarker(index: number): void {
    this.markers[index].marker.remove();

    this.markers.splice(index, 1);

    this.saveToLocalStorage();
  }

  moveToMarker(marker: Marker): void {
    this.map?.flyTo({
      zoom: 14,
      center: marker.getLngLat(),
    })
  }

  saveToLocalStorage(): void {
    const plainMarkers: PlainMarker[] = this.markers.map(({marker, color}) => {
      return{lngLat: marker.getLngLat().toArray(), color}
    });

    localStorage.setItem('plainMarkers', JSON.stringify(plainMarkers));

  }

  readFromLocalStorage(): void {
    const plainMarkersString = localStorage.getItem('plainMarkers') ?? '[]';

    const plainMarkers: PlainMarker[] = JSON.parse(plainMarkersString);

    plainMarkers.forEach(plainMarker => {
      const [lng, lat] = plainMarker.lngLat;
      const coords = new LngLat(lng, lat);

      this.addMarker(coords, plainMarker.color);
    });
  }

}
