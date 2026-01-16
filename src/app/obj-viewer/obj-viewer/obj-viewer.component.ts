import {AfterViewInit, Component, ElementRef, Input, OnChanges, OnDestroy} from '@angular/core';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import {DialogService, DynamicDialogComponent, DynamicDialogRef} from 'primeng/dynamicdialog';

@Component({
  selector: 'app-obj-viewer',
  templateUrl: './obj-viewer.component.html',
  styles: [`
    .obj-viewer-container {
      position: relative;
      width: 100%;
      height: 100%;
    }

    .controls {
      position: absolute;
      top: 10px;
      left: 10px;
      display: flex;
      align-items: center;
    }

    canvas {
      width: 100%;
      height: 100%;
    }

    p-button {
      margin-right: 10px;
    }
  `]
})
export class ObjViewerComponent implements AfterViewInit, OnDestroy {

  instance: DynamicDialogComponent | undefined;
  objUrl: string;

  private wireframe = false;
  private color = '#ffffff';

  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private controls: OrbitControls;

  constructor(private elementRef: ElementRef, public modalReference: DynamicDialogRef,
              private dialogService: DialogService) {
    this.instance = this.dialogService.getInstance(this.modalReference);
  }

  ngAfterViewInit(): void {
    if (this.instance && this.instance.data) {
      this.objUrl = this.instance.data['objUrl'];
    }
    this.initScene();
    this.loadObj();
    this.animate();
    window.addEventListener('resize', this.onResize.bind(this));
  }

  private initScene(): void {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, this.elementRef.nativeElement.offsetWidth / this.elementRef.nativeElement.offsetHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.elementRef.nativeElement.querySelector('canvas'),
      antialias: true
    });
    this.renderer.setSize(this.elementRef.nativeElement.offsetWidth, this.elementRef.nativeElement.offsetHeight);
    this.camera.aspect = this.elementRef.nativeElement.offsetWidth / this.elementRef.nativeElement.offsetHeight;
    this.camera.updateProjectionMatrix();
    // Position the camera
    this.camera.position.z = 50;
    // Add some basic lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(0, 0, 5);
    this.scene.add(pointLight);
    // Create orbit controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    console.log("scene init");
  }

  private loadObj(): void {
    if (this.objUrl) {
      const loader = new OBJLoader();
      loader.load(this.objUrl, (object) => {
        this.scene.add(object);
      }, (xhr) => {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
      }, (error) => {
        console.error('An error occurred:', error);
      });
    }
  }

  private onResize(): void {
    this.camera.aspect = this.elementRef.nativeElement.offsetWidth / this.elementRef.nativeElement.offsetHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.elementRef.nativeElement.offsetWidth, this.elementRef.nativeElement.offsetHeight);
  }

  private animate(): void {
    requestAnimationFrame(() => this.animate());
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  private toggleWireframe() {
    this.wireframe = !this.wireframe;
    this.scene.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        object.material.wireframe = this.wireframe;
      }
    });
  }

  private updateColor(): void {
    this.scene.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        object.material.color.setHex(parseInt(this.color.replace('#', ''), 16));
      }
    });
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.onResize.bind(this));
  }
}
