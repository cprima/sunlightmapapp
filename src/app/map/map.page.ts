import { Component, AfterViewInit, ViewChild, ElementRef, Renderer2, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { RefresherEventDetail } from '@ionic/core';

import { IonRefresher } from '@ionic/angular';

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements AfterViewInit {
  @ViewChild('canvas', { static: false }) canvasRef!: ElementRef;
  ctx!: CanvasRenderingContext2D;

  private apiUrl = environment.apiUrl; // replace with your API URL
  private fallbackImageUrl = 'assets/fallback.png'; // replace with your fallback image path
  private readonly HD_WIDTH = 1280;
  private readonly HD_HEIGHT = 720;

  canvasWidth: number = this.HD_WIDTH;
  canvasHeight: number = this.HD_HEIGHT;

  constructor(private http: HttpClient, private renderer: Renderer2) { }

  ngAfterViewInit() {
    this.ctx = this.canvasRef.nativeElement.getContext('2d');
    this.setCanvasDimensions();
    this.fetchImageData();
  }

  @HostListener('window:resize', ['$event'])
  handleOrientationChange(event: any) {
    this.setCanvasDimensions();
    this.fetchImageData();
  }

  private setCanvasDimensions() {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight - 56 /* height of ion-header */ - 50 /* height of ion-tabs */;

    if (screenWidth / this.HD_WIDTH < screenHeight / this.HD_HEIGHT) {
      this.canvasWidth = screenWidth;
      this.canvasHeight = (screenWidth / this.HD_WIDTH) * this.HD_HEIGHT;
    } else {
      this.canvasHeight = screenHeight;
      this.canvasWidth = (screenHeight / this.HD_HEIGHT) * this.HD_WIDTH;
    }

    const canvas = this.canvasRef.nativeElement;
    this.renderer.setProperty(canvas, 'width', this.canvasWidth);
    this.renderer.setProperty(canvas, 'height', this.canvasHeight);
  }

  private fetchImageData(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl, { Width: this.canvasWidth, Height: this.canvasHeight }).subscribe((response: any) => {
        if (response && response.Imgbase64) {
          const img = new Image();
          img.onload = () => {
            this.drawOnCanvas(img);
            resolve();
          };
          img.src = 'data:image/jpeg;base64,' + response.Imgbase64;
        } else {
          resolve();
        }
      }, error => {
        this.loadFallbackImage();
        resolve();
      });
    });
  }

  private drawOnCanvas(image: HTMLImageElement) {
    // Check if the canvas context has been properly initialized
    if (this.ctx) {
      // Clear the canvas to avoid overlapping drawings
      this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

      // Draw the given image onto the canvas.
      // This can be adjusted to scale, center, or crop as necessary.
      this.ctx.drawImage(image, 0, 0, this.canvasWidth, this.canvasHeight);
    }
  }


  // private loadFallbackImage() {
  //   const img = new Image();
  //   img.onload = () => {
  //     const ctx = this.canvasRef.nativeElement.getContext('2d');
  //     ctx.drawImage(img, 0, 0, this.canvasWidth, this.canvasHeight);
  //   };
  //   img.src = this.fallbackImageUrl;
  // }

  private loadFallbackImage(): void {
    const fallbackImage = new Image();
    fallbackImage.src = this.fallbackImageUrl;
    this.drawOnCanvas(fallbackImage);
  }


  doRefresh(event: Event) {
    this.fetchImageData()
      .then(() => {
        // After verifying that event is indeed of CustomEvent type, complete the refresh process
        (event as CustomEvent<RefresherEventDetail>).detail.complete();
      })
      .catch((err) => {
        console.error('Error fetching image data:', err);
        // Even in case of error, indicate the refresh has finished
        (event as CustomEvent<RefresherEventDetail>).detail.complete();
      });
  }


}
