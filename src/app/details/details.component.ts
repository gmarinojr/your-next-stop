import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router'
import { LocationService } from '../services/location.service';
import { map, take } from 'rxjs/operators';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {
  thumbColor = false;
  saveColor = false;
  state$: Observable<object>;
  placeId: string;
  selectedPlaceInfo: {
    photo: any,
    name: any,
    interest: any, 
    category: any, 
    priceLevel: any, 
    rating: any, 
    website: any, 
    phone: any, 
    address: any,
  };
  selectedPlacePhoto: null;
  currentUser = localStorage.getItem('userId');

  constructor(public activatedRoute: ActivatedRoute, private location: LocationService) { }
  
  toggleThumb() {
    this.thumbColor = !this.thumbColor;
  }

  toggleSave() {
    this.saveColor = !this.saveColor;
  }

  ngOnInit() {
    this.state$ = this.activatedRoute.paramMap
      .pipe(
        map((value) => this.placeId = window.history.state),
        take(1)
        )
    this.state$.subscribe(state => 
      this.getPlaceInfo(state));
}

  getPlaceInfo(place) {
    // console.log('PLACEEEE', place);
    this.location.getPlaceInfo(place)
    .subscribe((info: any) => {
      console.log('INFO', info);
      this.selectedPlaceInfo = info;
    })
  }

  onSelection(place, status) {
    console.log('PLACE UPVOTED', place, 'STATUS', status);
    if (status === 'liked') {
      this.toggleThumb();
    } else {
      this.toggleSave();
    }
    this.location.upvoteInterest(place, status, this.currentUser)
      .subscribe(response => {
        console.log('UPVOTE response', response);
      });
  }

}
