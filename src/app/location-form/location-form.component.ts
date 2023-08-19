import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, } from '@angular/forms';
import { ModalController } from '@ionic/angular';



@Component({
  selector: 'app-location-form',
  templateUrl: './location-form.component.html',
  styleUrls: ['./location-form.component.scss'],
})
export class LocationFormComponent implements OnInit {
  locationForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private modalController: ModalController) {
    this.locationForm = this.formBuilder.group({
      location: ['']
    });
  }

  ngOnInit() {
    this.initForm();
  }

  /**
   * Initialize the form with its controls.
   */
  private initForm() {
    this.locationForm = this.formBuilder.group({
      locationField: ['']  // Default value is an empty string.
    });
  }

  /**
   * Triggered when the "Geolocate!" button is clicked.
   */
  geolocate() {
    // Logic for geolocation can be added here.
    console.log("Geolocate clicked!");
  }

  onSubmit() {
    // Handle your form submission here...

    this.modalController.dismiss(); // Close the modal
  }
}